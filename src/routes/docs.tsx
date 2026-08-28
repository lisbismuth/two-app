import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, FileText, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { CardBarcode } from "@/components/card-barcode";
import { Button, EmptyState, Field, Input, Segmented, Sheet, Textarea } from "@/components/ui";
import { Page, PageHeader } from "@/components/shell";
import {
  CARD_CODE_FORMATS,
  hasElectronicCode,
  maskCode,
  normalizeCodeFormat,
  sanitizeCodeValue,
} from "@/lib/card-code";
import { fileToDataUrl } from "@/lib/images";
import { useAppStore } from "@/lib/store";
import type { CardCodeFormat, DocItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/docs")({ component: DocsPage });

function DocsPage() {
  const [tab, setTab] = useState<"doc" | "card">("card");
  const [viewer, setViewer] = useState<DocItem | null>(null);
  const [editing, setEditing] = useState<DocItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [addMenu, setAddMenu] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const docs = useAppStore((s) => s.docs);
  const addDoc = useAppStore((s) => s.addDoc);
  const updateDoc = useAppStore((s) => s.updateDoc);
  const deleteDoc = useAppStore((s) => s.deleteDoc);
  const visible = docs.filter((d) => d.kind === tab);

  const liveViewer = viewer ? (docs.find((d) => d.id === viewer.id) ?? null) : null;

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    const file = list[0]!;
    try {
      const { dataUrl, mime } = await fileToDataUrl(file);
      const fallback = tab === "card" ? "Карта" : "Документ";
      const name = file.name.replace(/\.[^.]+$/, "") || fallback;
      const id = addDoc({ title: name, kind: tab, mime, dataUrl });
      const created = useAppStore.getState().docs.find((d) => d.id === id);
      if (created) setEditing(created);
      toast(tab === "card" ? "Фото сохранено — можно добавить номер" : "Сохранили");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Не получилось добавить");
    } finally {
      if (cameraRef.current) cameraRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onAddClick() {
    if (tab === "card") setAddMenu(true);
    else fileRef.current?.click();
  }

  return (
    <Page>
      <PageHeader
        title={tab === "card" ? "Карты" : "Документы"}
        onAdd={onAddClick}
      />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "card", label: "Карты" },
          { value: "doc", label: "Документы" },
        ]}
      />

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      <input
        ref={fileRef}
        type="file"
        accept={tab === "card" ? "image/*" : "image/*,application/pdf"}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={tab === "card" ? <CardsGlyph /> : <FileGlyph />}
          title={tab === "card" ? "Скидочные карты" : "Билеты и страховки"}
          text={
            tab === "card"
              ? "Электронная карта с штрихкодом на кассе — или фото пластика. Номер рисуется только на телефоне."
              : "Всё, что добавите, хранится у вас и открывается офлайн."
          }
          action={
            tab === "card" ? (
              <Button
                onClick={() => {
                  setCreateOpen(true);
                }}
              >
                Электронная карта
              </Button>
            ) : (
              <Button onClick={() => cameraRef.current?.click()}>Сфотографировать</Button>
            )
          }
          secondary={
            <Button
              variant="secondary"
              onClick={() =>
                tab === "card" ? cameraRef.current?.click() : fileRef.current?.click()
              }
            >
              {tab === "card" ? "Только фото" : "Выбрать файл"}
            </Button>
          }
        />
      ) : tab === "card" ? (
        <ul className="mt-5 flex flex-col gap-3">
          {visible.map((d) => {
            const electronic = hasElectronicCode(d);
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setViewer(d)}
                  className="flex w-full items-stretch overflow-hidden rounded-card bg-surface text-left shadow-card transition-transform duration-150 active:scale-[0.98]"
                >
                  <div className="flex w-[7.5rem] shrink-0 items-center justify-center bg-chip sm:w-36">
                    {d.mime.startsWith("image/") && d.dataUrl ? (
                      <img
                        src={d.dataUrl}
                        alt=""
                        className="h-full min-h-[5.5rem] w-full object-cover"
                      />
                    ) : (
                      <CreditCard className="size-8 text-muted" strokeWidth={1.5} />
                    )}
                  </div>
                  <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3.5">
                    <span className="truncate text-[17px] font-bold leading-snug">{d.title}</span>
                    {electronic ? (
                      <span className="mt-1 font-mono text-[13px] tabular text-muted">
                        {maskCode(d.codeValue)}
                      </span>
                    ) : d.notes ? (
                      <span className="mt-1 line-clamp-2 text-[13px] text-muted">{d.notes}</span>
                    ) : (
                      <span className="mt-1 text-[13px] text-faint">Только фото</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-2">
          {visible.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setViewer(d)}
                className="w-full overflow-hidden rounded-card bg-surface text-left shadow-card"
              >
                <div className="aspect-[4/3] bg-chip">
                  {d.mime.startsWith("image/") && d.dataUrl ? (
                    <img src={d.dataUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted">
                      <FileText className="size-8" />
                    </div>
                  )}
                </div>
                <div className="px-3 py-2">
                  <p className="truncate text-[13px] font-semibold">{d.title}</p>
                  {d.notes ? (
                    <p className="mt-0.5 truncate text-[11px] text-muted">{d.notes}</p>
                  ) : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {liveViewer ? (
        <CardViewer
          item={liveViewer}
          onClose={() => setViewer(null)}
          onEdit={() => setEditing(liveViewer)}
          onDelete={() => {
            deleteDoc(liveViewer.id);
            setViewer(null);
            toast("Удалили");
          }}
        />
      ) : null}

      <Sheet open={addMenu} onOpenChange={setAddMenu} title="Добавить карту">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => {
              setAddMenu(false);
              setCreateOpen(true);
            }}
          >
            Электронная — номер и штрихкод
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setAddMenu(false);
              cameraRef.current?.click();
            }}
          >
            Сфотографировать
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setAddMenu(false);
              fileRef.current?.click();
            }}
          >
            Выбрать из галереи
          </Button>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Штрихкод рисуется только на этом телефоне. Номер не отправляется в сторонние сервисы —
            только вам двоим в приложении.
          </p>
        </div>
      </Sheet>

      <ElectronicCardSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(payload) => {
          const id = addDoc({
            title: payload.title,
            notes: payload.notes,
            kind: "card",
            codeValue: payload.codeValue,
            codeFormat: payload.codeFormat,
            mime: payload.mime,
            dataUrl: payload.dataUrl,
          });
          const created = useAppStore.getState().docs.find((d) => d.id === id);
          if (created) setViewer(created);
          toast("Карта готова");
          setCreateOpen(false);
        }}
      />

      <DocEditSheet
        open={!!editing}
        item={editing}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
        onSave={(patch) => {
          if (!editing) return;
          updateDoc(editing.id, patch);
          toast("Сохранили");
          setEditing(null);
        }}
        onDelete={() => {
          if (!editing) return;
          deleteDoc(editing.id);
          setViewer(null);
          setEditing(null);
          toast("Удалили");
        }}
      />
    </Page>
  );
}

function CardViewer({
  item,
  onClose,
  onEdit,
  onDelete,
}: {
  item: DocItem;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const electronic = hasElectronicCode(item);
  const format = normalizeCodeFormat(item.codeFormat);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col",
        electronic ? "bg-white" : "bg-ink/95",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
          electronic ? "text-ink" : "text-on-ink",
        )}
      >
        <p className="min-w-0 flex-1 truncate text-[15px] font-semibold">{item.title}</p>
        <button
          type="button"
          aria-label="Изменить"
          onClick={onEdit}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            electronic ? "bg-chip" : "bg-white/10",
          )}
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            electronic ? "bg-chip" : "bg-white/10",
          )}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        {electronic && format ? (
          <>
            <CardBarcode value={item.codeValue} format={format} />
            <p className="max-w-[90%] break-all text-center font-mono text-[13px] text-ink/70">
              {item.codeValue}
            </p>
            {item.notes ? (
              <p className="text-center text-[13px] text-muted">{item.notes}</p>
            ) : null}
          </>
        ) : item.mime.startsWith("image/") && item.dataUrl ? (
          <img
            src={item.dataUrl}
            alt={item.title}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        ) : item.dataUrl ? (
          <iframe title={item.title} src={item.dataUrl} className="h-full w-full rounded-lg bg-surface" />
        ) : (
          <p className="text-[14px] text-muted">Нет данных для показа</p>
        )}
      </div>

      <div className="flex flex-col gap-2 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {electronic && item.dataUrl && item.mime.startsWith("image/") ? (
          <p className="mb-1 text-center text-[12px] text-muted">Есть фото пластика — в редактировании</p>
        ) : null}
        <Button
          variant={electronic ? "secondary" : "secondary"}
          className={electronic ? undefined : "border-0 bg-white/10 text-on-ink ring-0"}
          onClick={onEdit}
        >
          Изменить
        </Button>
        <Button
          variant="ghost"
          className={electronic ? undefined : "text-white/80"}
          onClick={onDelete}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}

function ElectronicCardSheet({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (payload: {
    title: string;
    notes: string;
    codeValue: string;
    codeFormat: CardCodeFormat;
    mime: string;
    dataUrl: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [codeFormat, setCodeFormat] = useState<CardCodeFormat>("CODE128");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<{ mime: string; dataUrl: string } | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setCodeValue("");
    setCodeFormat("CODE128");
    setNotes("");
    setPhoto(null);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Электронная карта">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const code = sanitizeCodeValue(codeValue);
          if (!title.trim()) {
            toast("Укажите название");
            return;
          }
          if (!code) {
            toast("Введите номер с карты");
            return;
          }
          onCreate({
            title: title.trim(),
            notes: notes.trim(),
            codeValue: code,
            codeFormat,
            mime: photo?.mime ?? "",
            dataUrl: photo?.dataUrl ?? "",
          });
        }}
      >
        <Field label="Название">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Пятёрочка, Лента, Аптека…"
            autoFocus
            required
            autoComplete="off"
          />
        </Field>
        <Field label="Номер карты">
          <Input
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            placeholder="Как на пластике или в приложении"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            required
          />
        </Field>
        <Field label="Формат кода">
          <div className="flex flex-wrap gap-1.5">
            {CARD_CODE_FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCodeFormat(f.id)}
                className={cn(
                  "h-9 rounded-full px-3 text-[13px] font-semibold",
                  codeFormat === f.id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[12px] text-muted">
            {CARD_CODE_FORMATS.find((f) => f.id === codeFormat)?.hint}
          </p>
        </Field>
        <Field label="Заметка">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Необязательно"
            rows={2}
          />
        </Field>
        <div>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const { dataUrl, mime } = await fileToDataUrl(file);
                setPhoto({ dataUrl, mime });
              } catch {
                toast("Фото не загрузилось");
              }
              e.target.value = "";
            }}
          />
          <Button type="button" variant="secondary" onClick={() => photoRef.current?.click()}>
            {photo ? "Заменить фото (необяз.)" : "Добавить фото (необяз.)"}
          </Button>
          {photo ? (
            <img src={photo.dataUrl} alt="" className="mt-2 max-h-24 rounded-card object-contain" />
          ) : null}
        </div>
        <p className="text-[12px] leading-relaxed text-muted">
          Номер хранится только в вашем приложении (и у партнёра после синхронизации). Штрихкод
          рисуется на экране локально — без отправки на чужие сервера.
        </p>
        <Button type="submit">Сохранить карту</Button>
      </form>
    </Sheet>
  );
}

function DocEditSheet({
  open,
  item,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  item: DocItem | null;
  onOpenChange: (v: boolean) => void;
  onSave: (patch: {
    title: string;
    notes: string;
    codeValue: string;
    codeFormat: CardCodeFormat | "";
  }) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [codeFormat, setCodeFormat] = useState<CardCodeFormat>("CODE128");
  const isCard = item?.kind === "card";

  useEffect(() => {
    if (!open || !item) return;
    setTitle(item.title);
    setNotes(item.notes ?? "");
    setCodeValue(item.codeValue ?? "");
    setCodeFormat(normalizeCodeFormat(item.codeFormat) || "CODE128");
  }, [open, item]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={isCard ? "Карта" : "Документ"}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const code = sanitizeCodeValue(codeValue);
          onSave({
            title: title.trim() || (isCard ? "Карта" : "Документ"),
            notes: notes.trim(),
            codeValue: isCard ? code : "",
            codeFormat: isCard && code ? codeFormat : "",
          });
        }}
      >
        {item?.mime.startsWith("image/") && item.dataUrl ? (
          <div className="overflow-hidden rounded-card bg-chip">
            <img src={item.dataUrl} alt="" className="mx-auto max-h-36 object-contain" />
          </div>
        ) : null}
        <Field label={isCard ? "Название карты" : "Название"}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isCard ? "Пятёрочка, Лента…" : "Билет, страховка…"}
            autoFocus
            required
            autoComplete="off"
          />
        </Field>
        {isCard ? (
          <>
            <Field label="Номер для штрихкода">
              <Input
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                placeholder="Пусто = только фото"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            {codeValue.trim() ? (
              <Field label="Формат кода">
                <div className="flex flex-wrap gap-1.5">
                  {CARD_CODE_FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setCodeFormat(f.id)}
                      className={cn(
                        "h-9 rounded-full px-3 text-[13px] font-semibold",
                        codeFormat === f.id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </Field>
            ) : null}
          </>
        ) : null}
        <Field label="Заметка">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Необязательно"
            rows={2}
          />
        </Field>
        <Button type="submit">Сохранить</Button>
        <Button variant="ghost" onClick={onDelete}>
          Удалить
        </Button>
      </form>
    </Sheet>
  );
}

function CardsGlyph() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="48" height="30" rx="6" stroke="#D4D0C8" strokeWidth="2.2" />
      <rect x="12" y="6" width="48" height="30" rx="6" fill="#EDEAE4" stroke="#D4D0C8" strokeWidth="2.2" />
      <rect x="18" y="14" width="18" height="4" rx="2" fill="#D4D0C8" />
      <rect x="18" y="22" width="28" height="3" rx="1.5" fill="#D4D0C8" />
    </svg>
  );
}

function FileGlyph() {
  return (
    <svg width="56" height="64" viewBox="0 0 56 64" fill="none" aria-hidden="true">
      <path
        d="M8 6c0-2.2 1.8-4 4-4h24l16 16v40c0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4V6z"
        stroke="#D4D0C8"
        strokeWidth="2.4"
      />
      <path d="M36 2v12c0 2.2 1.8 4 4 4h12" stroke="#D4D0C8" strokeWidth="2.4" />
      <path d="M18 34h20M18 42h14" stroke="#D4D0C8" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
