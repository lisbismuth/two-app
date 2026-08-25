import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { addMonths, format, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Input, Sheet, Textarea } from "@/components/ui";
import { Page, PageHeader } from "@/components/shell";
import { buildCalendarItems, monthCells, sameDay, upcomingItems } from "@/lib/dates";
import { MONTHS_SHORT, WEEKDAYS } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import type { CalendarItem } from "@/lib/types";
import { capitalize, cn, isoDate, parseISODate, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const partners = useAppStore((s) => s.partners);
  const startedAt = useAppStore((s) => s.startedAt);
  const events = useAppStore((s) => s.events);
  const tasks = useAppStore((s) => s.tasks);

  const items = useMemo(() => {
    const rangeStart = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    const rangeEnd = new Date(cursor.getFullYear() + 1, cursor.getMonth() + 2, 0);
    return buildCalendarItems({ partners, startedAt, events, tasks, rangeStart, rangeEnd });
  }, [partners, startedAt, events, tasks, cursor]);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const it of items) {
      const list = map.get(it.date) ?? [];
      list.push(it);
      map.set(it.date, list);
    }
    return map;
  }, [items]);

  const cells = monthCells(cursor.getFullYear(), cursor.getMonth());
  const today = new Date();
  const selectedKey = isoDate(selected);
  const dayItems = byDate.get(selectedKey) ?? [];
  const upcoming = upcomingItems(items, today, 6);

  return (
    <Page>
      <PageHeader
        kicker={format(today, "eeee, d MMMM", { locale: ru })}
        title={capitalize(format(cursor, "LLLL", { locale: ru }))}
        avatar
        kickerUpper={false}
        extra={
          <>
            <button
              type="button"
              aria-label="Предыдущий месяц"
              onClick={() => setCursor((d) => subMonths(d, 1))}
              className="flex size-9 items-center justify-center text-ink"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Следующий месяц"
              onClick={() => setCursor((d) => addMonths(d, 1))}
              className="flex size-9 items-center justify-center text-ink"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        }
      />

      <div className="grid grid-cols-7 gap-y-0.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            {d}
          </div>
        ))}
        {cells.map((d) => {
          const key = isoDate(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = sameDay(d, today);
          const isSelected = sameDay(d, selected);
          const has = (byDate.get(key) ?? []).length > 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(d)}
              className={cn(
                "relative mx-auto flex size-9 items-center justify-center rounded-full text-[15px] font-medium",
                !inMonth && "text-faint",
                inMonth && !isToday && !isSelected && "text-ink",
                isToday && "bg-ink text-on-ink",
                isSelected && !isToday && "bg-chip text-ink",
              )}
            >
              {d.getDate()}
              {has && !isToday ? (
                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-rose" />
              ) : null}
            </button>
          );
        })}
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            {sameDay(selected, today) ? "Ближайшие" : format(selected, "d MMMM", { locale: ru })}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[15px] font-semibold text-link"
          >
            Добавить
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {(sameDay(selected, today) ? upcoming : dayItems).length === 0 ? (
            <p className="rounded-card bg-surface px-4 py-5 text-[14px] text-muted shadow-card">
              Пока тихо. Добавьте дату — она появится здесь и в сетке.
            </p>
          ) : (
            (sameDay(selected, today) ? upcoming : dayItems).map((it) => <EventCard key={it.id} item={it} />)
          )}
        </div>
      </section>

      <EventSheet open={open} onOpenChange={setOpen} defaultDate={selectedKey} />
    </Page>
  );
}

function EventCard({ item }: { item: CalendarItem }) {
  const d = parseISODate(item.date);
  return (
    <article className="flex items-stretch overflow-hidden rounded-card bg-surface shadow-card">
      <div className="flex w-[68px] shrink-0 flex-col items-center justify-center py-4">
        <span className="text-[22px] font-extrabold leading-none tabular">{d.getDate()}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {MONTHS_SHORT[d.getMonth()]}
        </span>
      </div>
      <div
        className="my-4 w-[3px] shrink-0 rounded-full"
        style={{ background: item.color || "var(--color-rose)" }}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center py-4 pr-4 pl-3">
        <p className="truncate text-[16px] font-bold leading-snug">{item.title}</p>
        {item.subtitle ? <p className="mt-0.5 truncate text-[13px] text-muted">{item.subtitle}</p> : null}
      </div>
    </article>
  );
}

function EventSheet({
  open,
  onOpenChange,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDate: string;
}) {
  const addEvent = useAppStore((s) => s.addEvent);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(defaultDate);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setNotes("");
    setDate(defaultDate || todayISO());
  }, [open, defaultDate]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Важная дата">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !date) return;
          addEvent({ title, notes, date });
          toast("Дата в календаре");
          onOpenChange(false);
        }}
      >
        <Field label="Название">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Годовщина, поездка, встреча" required />
        </Field>
        <Field label="Дата">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Field>
        <Field label="Подпись">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="4 года вместе" rows={2} />
        </Field>
        <Button type="submit" className="mt-2">
          Добавить
        </Button>
      </form>
    </Sheet>
  );
}
