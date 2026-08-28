import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, FileText, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Button, EmptyState, Field, Input, Segmented, Sheet, Textarea } from "@/components/ui";
import { Page, PageHeader } from "@/components/shell";
import { fileToDataUrl } from "@/lib/images";
import { useAppStore } from "@/lib/store";
import type { DocItem } from "@/lib/types";

export const Route = createFileRoute("/docs")({ component: DocsPage });

function DocsPage() {
  const [tab, setTab] = useState<"doc" | "card">("card");
  const [viewer, setViewer] = useState<DocItem | null>(null);
  const [editing, setEditing] = useState<DocItem | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const docs = useAppStore((s) => s.docs);
  const addDoc = useAppStore((s) => s.addDoc);
  const updateDoc = useAppStore((s) => s.updateDoc);
  const deleteDoc = useAppStore((s) => s.deleteDoc);
  const visible = docs.filter((d) => d.kind === tab);

  // Keep viewer in sync after rename
  const liveViewer = viewer ? docs.find((d) => d.id === viewer.id) ?? null : null;

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
      toast("Добавили — можно переименовать");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Не получилось добавить");
    } finally {
      if (cameraRef.current) cameraRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Page>
      <PageHeader
        title={tab === "card" ? "Карты" : "Документы"}
        onAdd={() => fileRef.current?.click()}
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
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={tab === "card" ? <CardsGlyph /> : <FileGlyph />}
          title={tab === "card" ? "Скидочные карты" : "Билеты и страховки"}
          text={
            tab === "card"
              ? "Сфотографируйте карту, дайте имя — на кассе откроется без интернета."
              : "Всё, что добавите, хранится на устройстве и открывается офлайн."
          }
          action={<Button onClick={() => cameraRef.current?.click()}>Сфотографировать</Button>}
          secondary={
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Выбрать файл
            </Button>
          }
        />
      ) : tab === "card" ? (
        <ul className="mt-5 flex flex-col gap-3">
          {visible.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setViewer(d)}
                className="flex w-full items-stretch overflow-hidden rounded-card bg-surface text-left shadow-card transition-transform duration-150 active:scale-[0.98]"
              >
                <div className="w-[7.5rem] shrink-0 bg-chip sm:w-36">
                  {d.mime.startsWith("image/") ? (
                    <img src={d.dataUrl} alt="" className="h-full min-h-[5.5rem] w-full object-cover" />
                  ) : (
                    <div className="flex min-h-[5.5rem] size-full items-center justify-center text-muted">
                      <CreditCard className="size-7" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3.5">
                  <span className="truncate text-[17px] font-bold leading-snug">{d.title}</span>
                  {d.notes ? (
                    <span className="mt-1 line-clamp-2 text-[13px] text-muted">{d.notes}</span>
                  ) : (
                    <span className="mt-1 text-[13px] text-faint">Нажмите, чтобы показать на кассе</span>
                  )}
                </span>
              </button>
            </li>
          ))}
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
                  {d.mime.startsWith("image/") ? (
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
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/95">
          <div className="flex items-center gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
            <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-on-ink">
              {liveViewer.title}
            </p>
            <button
              type="button"
              aria-label="Изменить"
              onClick={() => {
                setEditing(liveViewer);
              }}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-on-ink"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setViewer(null)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-on-ink"
            >
              <X className="size-5" />
            </button>
          </div>
          {liveViewer.notes ? (
            <p className="px-5 pb-2 text-center text-[13px] text-white/70">{liveViewer.notes}</p>
          ) : null}
          <div className="flex flex-1 items-center justify-center p-4">
            {liveViewer.mime.startsWith("image/") ? (
              <img
                src={liveViewer.dataUrl}
                alt={liveViewer.title}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            ) : (
              <iframe
                title={liveViewer.title}
                src={liveViewer.dataUrl}
                className="h-full w-full rounded-lg bg-surface"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Button
              variant="secondary"
              className="border-0 bg-white/10 text-on-ink ring-0"
              onClick={() => setEditing(liveViewer)}
            >
              Переименовать
            </Button>
            <Button
              variant="ghost"
              className="text-white/80"
              onClick={() => {
                deleteDoc(liveViewer.id);
                setViewer(null);
                toast("Удалили");
              }}
            >
              Удалить
            </Button>
          </div>
        </div>
      ) : null}

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
  onSave: (patch: { title: string; notes: string }) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const isCard = item?.kind === "card";

  useEffect(() => {
    if (!open || !item) return;
    setTitle(item.title);
    setNotes(item.notes ?? "");
  }, [open, item]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={isCard ? "Карта" : "Документ"}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            title: title.trim() || (isCard ? "Карта" : "Документ"),
            notes: notes.trim(),
          });
        }}
      >
        {item?.mime.startsWith("image/") ? (
          <div className="overflow-hidden rounded-card bg-chip">
            <img src={item.dataUrl} alt="" className="mx-auto max-h-36 object-contain" />
          </div>
        ) : null}
        <Field label={isCard ? "Название карты" : "Название"}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isCard ? "Пятёрочка, Лента, Аптека…" : "Билет, страховка…"}
            autoFocus
            required
          />
        </Field>
        <Field label={isCard ? "Заметка — номер, бонусы…" : "Заметка"}>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={isCard ? "Необязательно" : "Необязательно"}
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
