import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Button, EmptyState, Segmented } from "@/components/ui";
import { Page, PageHeader } from "@/components/shell";
import { fileToDataUrl } from "@/lib/images";
import { useAppStore } from "@/lib/store";
import type { DocItem } from "@/lib/types";

export const Route = createFileRoute("/docs")({ component: DocsPage });

function DocsPage() {
  const [tab, setTab] = useState<"doc" | "card">("doc");
  const [viewer, setViewer] = useState<DocItem | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const docs = useAppStore((s) => s.docs);
  const addDoc = useAppStore((s) => s.addDoc);
  const deleteDoc = useAppStore((s) => s.deleteDoc);
  const visible = docs.filter((d) => d.kind === tab);

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    const file = list[0]!;
    try {
      const { dataUrl, mime } = await fileToDataUrl(file);
      const name = file.name.replace(/\.[^.]+$/, "") || (tab === "card" ? "Карта" : "Документ");
      addDoc({ title: name, kind: tab, mime, dataUrl });
      toast("Сохранили на устройство");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Не получилось добавить");
    } finally {
      if (cameraRef.current) cameraRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Page>
      <PageHeader title="Документы" onAdd={() => fileRef.current?.click()} />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "doc", label: "Документы" },
          { value: "card", label: "Карты" },
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
          icon={<FileGlyph />}
          title={tab === "card" ? "Карты будут здесь" : "Здесь будут билеты и страховки"}
          text="Всё, что добавите, сразу ляжет на устройство и откроется без интернета."
          action={<Button onClick={() => cameraRef.current?.click()}>Сфотографировать</Button>}
          secondary={
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Выбрать файл
            </Button>
          }
        />
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
                <p className="truncate px-3 py-2 text-[13px] font-semibold">{d.title}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {viewer ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/90">
          <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
            <p className="truncate pr-4 text-[15px] font-semibold text-on-ink">{viewer.title}</p>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setViewer(null)}
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-on-ink"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center p-4">
            {viewer.mime.startsWith("image/") ? (
              <img src={viewer.dataUrl} alt={viewer.title} className="max-h-full max-w-full rounded-lg object-contain" />
            ) : (
              <iframe title={viewer.title} src={viewer.dataUrl} className="h-full w-full rounded-lg bg-surface" />
            )}
          </div>
          <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Button
              variant="secondary"
              className="border-0 bg-white/10 text-on-ink ring-0"
              onClick={() => {
                deleteDoc(viewer.id);
                setViewer(null);
                toast("Удалили");
              }}
            >
              Удалить
            </Button>
          </div>
        </div>
      ) : null}
    </Page>
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
