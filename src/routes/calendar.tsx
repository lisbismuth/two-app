import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { addMonths, format, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Input, Sheet, Textarea } from "@/components/ui";
import { DatePicker } from "@/components/date-picker";
import { buildCalendarItems, monthCells, sameDay, upcomingItems } from "@/lib/dates";
import { MONTHS_SHORT, WEEKDAYS } from "@/lib/i18n";
import { otherId, useAppStore, useMe, usePartner } from "@/lib/store";
import type { CalendarItem, TaskAssignee, TaskItem } from "@/lib/types";
import { capitalize, cn, isoDate, parseISODate, todayISO } from "@/lib/utils";

/** Old /calendar links land on the combined Дела tab. */
export const Route = createFileRoute("/calendar")({
  component: () => <Navigate to="/" search={{ view: "calendar" }} replace />,
});

export function CalendarPanel() {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [eventOpen, setEventOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

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

  function openItem(item: CalendarItem) {
    if (item.kind === "task") {
      const taskId = item.id.startsWith("task-") ? item.id.slice(5) : item.id;
      const task = tasks.find((t) => t.id === taskId) ?? null;
      if (!task) return;
      setEditingTask(task);
      setTaskOpen(true);
      return;
    }
    if (item.kind === "event") {
      setEditingEventId(item.id);
      setEventOpen(true);
      return;
    }
    toast("Это фиксированная дата — её нельзя изменить");
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-extrabold tracking-tight">
          {capitalize(format(cursor, "LLLL", { locale: ru }))}
        </h2>
        <div className="flex items-center gap-1">
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
        </div>
      </div>

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
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            {sameDay(selected, today) ? "Ближайшие" : format(selected, "d MMMM", { locale: ru })}
          </h3>
          <button
            type="button"
            onClick={() => {
              setEditingEventId(null);
              setEventOpen(true);
            }}
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
            (sameDay(selected, today) ? upcoming : dayItems).map((it) => (
              <EventCard key={it.id} item={it} onOpen={() => openItem(it)} />
            ))
          )}
        </div>
      </section>

      <EventSheet
        open={eventOpen}
        onOpenChange={(v) => {
          setEventOpen(v);
          if (!v) setEditingEventId(null);
        }}
        defaultDate={selectedKey}
        editingId={editingEventId}
      />

      <CalTaskSheet
        open={taskOpen}
        onOpenChange={(v) => {
          setTaskOpen(v);
          if (!v) setEditingTask(null);
        }}
        editing={editingTask}
      />
    </>
  );
}

function EventCard({ item, onOpen }: { item: CalendarItem; onOpen: () => void }) {
  const d = parseISODate(item.date);
  const editable = item.kind === "task" || item.kind === "event";
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-card bg-surface text-left shadow-card",
        editable && "transition-transform duration-150 active:scale-[0.98]",
      )}
    >
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
    </button>
  );
}

function EventSheet({
  open,
  onOpenChange,
  defaultDate,
  editingId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDate: string;
  editingId: string | null;
}) {
  const events = useAppStore((s) => s.events);
  const addEvent = useAppStore((s) => s.addEvent);
  const updateEvent = useAppStore((s) => s.updateEvent);
  const deleteEvent = useAppStore((s) => s.deleteEvent);
  const editing = editingId ? events.find((e) => e.id === editingId) : null;

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(defaultDate);

  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setNotes(editing?.notes ?? "");
    setDate(editing?.date ?? (defaultDate || todayISO()));
  }, [open, defaultDate, editing]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={editing ? "Дата" : "Важная дата"}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !date) return;
          if (editing) {
            updateEvent(editing.id, { title: title.trim(), notes, date });
            toast("Сохранили");
          } else {
            addEvent({ title, notes, date });
            toast("Дата в календаре");
          }
          onOpenChange(false);
        }}
      >
        <Field label="Название">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Годовщина, поездка, встреча" required />
        </Field>
        <Field label="Дата">
          <DatePicker value={date} onChange={setDate} placeholder="Выберите дату" />
        </Field>
        <Field label="Подпись">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="4 года вместе" rows={2} />
        </Field>
        <Button type="submit" className="mt-2">
          {editing ? "Сохранить" : "Добавить"}
        </Button>
        {editing ? (
          <Button
            variant="ghost"
            onClick={() => {
              deleteEvent(editing.id);
              toast("Удалили");
              onOpenChange(false);
            }}
          >
            Удалить
          </Button>
        ) : null}
      </form>
    </Sheet>
  );
}

function CalTaskSheet({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: TaskItem | null;
}) {
  const updateTask = useAppStore((s) => s.updateTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const me = useMe();
  const partner = usePartner();
  const currentId = useAppStore((s) => s.currentId);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [assignee, setAssignee] = useState<TaskAssignee>("none");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!open || !editing) return;
    setTitle(editing.title);
    setNotes(editing.notes);
    setAssignee(editing.assignee);
    setDueDate(editing.dueDate ?? "");
  }, [open, editing]);

  if (!editing) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Задача">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          updateTask(editing.id, {
            title: title.trim(),
            notes,
            assignee,
            dueDate: dueDate || null,
          });
          toast("Сохранили");
          onOpenChange(false);
        }}
      >
        <Field label="Что сделать">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Коротко и ясно" required />
        </Field>
        <Field label="Заметка">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Если нужно уточнить" rows={3} />
        </Field>
        <Field label="Кто делает">
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                ["none", "Никто"],
                [currentId, me.name],
                [otherId(currentId), partner.name],
              ] as [TaskAssignee, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setAssignee(id)}
                className={cn(
                  "h-11 rounded-full px-2 text-[13px] font-semibold",
                  assignee === id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Срок — попадёт в календарь">
          <DatePicker value={dueDate} onChange={setDueDate} placeholder="Без срока" allowClear />
        </Field>
        <Button type="submit" className="mt-2">
          Сохранить
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            deleteTask(editing.id);
            toast("Удалили");
            onOpenChange(false);
          }}
        >
          Удалить
        </Button>
      </form>
    </Sheet>
  );
}
