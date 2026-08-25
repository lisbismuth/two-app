import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import { Button, EmptyState, Field, Input, Segmented, Sheet, Textarea } from "@/components/ui";
import { Page, PageHeader } from "@/components/shell";
import { genitiveName } from "@/lib/i18n";
import { fetchLinkMeta } from "@/lib/images";
import { otherId, useAppStore, useMe, usePartner } from "@/lib/store";
import type { PartnerId, PlanItem, WishItem } from "@/lib/types";
import { cn, isUrl, titleFromUrl } from "@/lib/utils";

export const Route = createFileRoute("/wishes")({ component: WishesPage });

function WishesPage() {
  const [tab, setTab] = useState<"wishes" | "plans">("wishes");
  const [openWish, setOpenWish] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const wishes = useAppStore((s) => s.wishes);
  const plans = useAppStore((s) => s.plans);

  return (
    <Page>
      <PageHeader
        title="Хотелки"
        onAdd={() => (tab === "wishes" ? setOpenWish(true) : setOpenPlan(true))}
      />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "wishes", label: "Хотелки" },
          { value: "plans", label: "Планы" },
        ]}
      />

      {tab === "wishes" ? (
        wishes.length === 0 ? (
          <EmptyState
            icon={<Gift className="size-16" strokeWidth={1.2} />}
            title="Список пуст"
            text="Киньте ссылку на товар — название, цена и картинка подтянутся сами."
            action={<Button onClick={() => setOpenWish(true)}>Добавить хотелку</Button>}
            footnote="или вставить из буфера"
          />
        ) : (
          <ul className="mt-5 flex flex-col gap-2">
            {wishes.map((w) => (
              <WishCard key={w.id} wish={w} />
            ))}
          </ul>
        )
      ) : plans.length === 0 ? (
        <EmptyState
          icon={<Gift className="size-16" strokeWidth={1.2} />}
          title="Пока без планов"
          text="Поездка, ужин, ремонт — всё, что хотите сделать вдвоём."
          action={<Button onClick={() => setOpenPlan(true)}>Добавить план</Button>}
        />
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </ul>
      )}

      <WishSheet open={openWish} onOpenChange={setOpenWish} />
      <PlanSheet open={openPlan} onOpenChange={setOpenPlan} />
    </Page>
  );
}

function WishCard({ wish }: { wish: WishItem }) {
  const partners = useAppStore((s) => s.partners);
  const toggleWish = useAppStore((s) => s.toggleWish);
  const deleteWish = useAppStore((s) => s.deleteWish);
  const who = partners[wish.forId];

  return (
    <li className="flex gap-3 overflow-hidden rounded-card bg-surface p-3 shadow-card">
      <div
        className="size-[72px] shrink-0 overflow-hidden rounded-[14px] bg-chip"
        style={wish.image ? undefined : { background: who.color + "33" }}
      >
        {wish.image ? (
          <img src={wish.image} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted">
            <Gift className="size-7" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-[16px] font-bold", wish.done && "text-muted line-through")}>{wish.title}</p>
        <p className="mt-0.5 text-[13px] text-muted">
          {wish.price ? `${wish.price} · ` : ""}для {genitiveName(who.name)}
        </p>
        <div className="mt-2 flex gap-1.5">
          <Button size="chip" variant="secondary" onClick={() => toggleWish(wish.id)}>
            {wish.done ? "Вернуть" : "Исполнено"}
          </Button>
          {wish.url ? (
            <a
              href={wish.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center rounded-full px-3 text-xs font-medium text-link"
            >
              Ссылка
            </a>
          ) : null}
          <Button size="chip" variant="ghost" onClick={() => deleteWish(wish.id)}>
            Удалить
          </Button>
        </div>
      </div>
    </li>
  );
}

function PlanCard({ plan }: { plan: PlanItem }) {
  const togglePlan = useAppStore((s) => s.togglePlan);
  const deletePlan = useAppStore((s) => s.deletePlan);
  return (
    <li className="rounded-card bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-[16px] font-bold", plan.closed && "text-muted line-through")}>{plan.title}</p>
          <p className="mt-0.5 text-[13px] text-muted">
            {plan.kind === "trip" ? "Поездка" : "План"}
            {plan.date ? ` · ${format(new Date(plan.date + "T12:00:00"), "d MMMM", { locale: ru })}` : ""}
          </p>
          {plan.notes ? <p className="mt-2 text-[14px] text-ink-soft">{plan.notes}</p> : null}
        </div>
      </div>
      <div className="mt-3 flex gap-1.5">
        <Button size="chip" variant="secondary" onClick={() => togglePlan(plan.id)}>
          {plan.closed ? "Открыть снова" : "Закрыть"}
        </Button>
        <Button size="chip" variant="ghost" onClick={() => deletePlan(plan.id)}>
          Удалить
        </Button>
      </div>
    </li>
  );
}

function WishSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addWish = useAppStore((s) => s.addWish);
  const me = useMe();
  const partner = usePartner();
  const currentId = useAppStore((s) => s.currentId);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [forId, setForId] = useState<PartnerId>(currentId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setUrl("");
    setPrice("");
    setImage("");
    setForId(currentId);
  }, [open, currentId]);

  async function applyUrl(raw: string) {
    setUrl(raw);
    if (!isUrl(raw)) return;
    if (!title) setTitle(titleFromUrl(raw));
    setLoading(true);
    try {
      const meta = await fetchLinkMeta(raw);
      if (meta.title) setTitle(meta.title);
      if (meta.image) setImage(meta.image);
    } catch {
      /* keep local parse */
    } finally {
      setLoading(false);
    }
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (isUrl(text)) await applyUrl(text.trim());
      else if (text) setTitle(text.trim());
    } catch {
      toast("Нет доступа к буферу — вставьте ссылку вручную");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Новая хотелка">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addWish({ title, url, price, image, forId });
          toast("Добавили в список");
          onOpenChange(false);
        }}
      >
        <Field label="Ссылка">
          <Input
            value={url}
            onChange={(e) => applyUrl(e.target.value)}
            placeholder="https://"
            inputMode="url"
          />
        </Field>
        <button type="button" onClick={paste} className="self-start text-[13px] font-semibold text-link">
          Вставить из буфера
        </button>
        <Field label="Название">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={loading ? "Подтягиваем…" : "Что хочется"} required />
        </Field>
        <Field label="Цена">
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4 500 ₽" />
        </Field>
        <Field label="Для кого">
          <div className="grid grid-cols-2 gap-1.5">
            {([currentId, otherId(currentId)] as PartnerId[]).map((id) => {
              const p = id === currentId ? me : partner;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForId(id)}
                  className={cn(
                    "h-11 rounded-full text-[13px] font-semibold",
                    forId === id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                  )}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </Field>
        <Button type="submit" className="mt-2">
          Добавить хотелку
        </Button>
      </form>
    </Sheet>
  );
}

function PlanSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addPlan = useAppStore((s) => s.addPlan);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [kind, setKind] = useState<PlanItem["kind"]>("plan");

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setNotes("");
    setDate("");
    setKind("plan");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Новый план">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addPlan({ title, notes, date: date || null, kind });
          toast("План записан");
          onOpenChange(false);
        }}
      >
        <Field label="Что планируете">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="Тип">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setKind("plan")}
              className={cn("h-11 rounded-full text-[13px] font-semibold", kind === "plan" ? "bg-ink text-on-ink" : "bg-chip")}
            >
              План
            </button>
            <button
              type="button"
              onClick={() => setKind("trip")}
              className={cn("h-11 rounded-full text-[13px] font-semibold", kind === "trip" ? "bg-ink text-on-ink" : "bg-chip")}
            >
              Поездка
            </button>
          </div>
        </Field>
        <Field label="Дата">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Заметка">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </Field>
        <Button type="submit" className="mt-2">
          Добавить
        </Button>
      </form>
    </Sheet>
  );
}
