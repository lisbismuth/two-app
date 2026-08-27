import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, RotateCcw } from "lucide-react";

import { toast } from "sonner";
import { Button, EmptyState, Field, Input, Segmented, Sheet, Textarea } from "@/components/ui";
import { DatePicker } from "@/components/date-picker";
import { Page, PageHeader } from "@/components/shell";
import { CalendarPanel } from "@/routes/calendar";
import { otherId, useAppStore, useMe, usePartner } from "@/lib/store";
import { normalizeRepeat, repeatLabel, TASK_REPEAT_OPTIONS } from "@/lib/task-repeat";
import type { TaskAssignee, TaskItem, TaskRepeat } from "@/lib/types";
import { cn, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

type View = "list" | "calendar";
type TaskFilter = "all" | "shared" | "me" | "partner" | "done";

function HomePage() {
  const [view, setView] = useState<View>("list");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const tasks = useAppStore((s) => s.tasks);
  const currentId = useAppStore((s) => s.currentId);
  const partners = useAppStore((s) => s.partners);
  const me = useMe();
  const partner = usePartner();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);

  const counts = useMemo(() => {
    const openTasks = tasks.filter((t) => !t.done);
    return {
      all: openTasks.length,
      shared: openTasks.filter((t) => t.assignee === "none").length,
      me: openTasks.filter((t) => t.assignee === currentId).length,
      partner: openTasks.filter((t) => t.assignee === otherId(currentId)).length,
      done: tasks.filter((t) => t.done).length,
    };
  }, [tasks, currentId]);

  const filtered = useMemo(() => {
    if (filter === "all") return tasks.filter((t) => !t.done);
    if (filter === "shared") return tasks.filter((t) => !t.done && t.assignee === "none");
    if (filter === "me") return tasks.filter((t) => !t.done && t.assignee === currentId);
    if (filter === "partner") return tasks.filter((t) => !t.done && t.assignee === otherId(currentId));
    return tasks.filter((t) => t.done);
  }, [tasks, filter, currentId]);

  const filterOptions: { value: TaskFilter; label: string; count: number }[] = [
    { value: "all", label: "Все", count: counts.all },
    { value: "shared", label: "Общие", count: counts.shared },
    { value: "me", label: me.name, count: counts.me },
    { value: "partner", label: partner.name, count: counts.partner },
    { value: "done", label: "Готово", count: counts.done },
  ];

  return (
    <Page>
      <PageHeader
        title="Дела"
        onAdd={
          view === "list"
            ? () => {
                setEditing(null);
                setOpen(true);
              }
            : undefined
        }
      />

      <div className="mb-4">
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: "list", label: "Задачи" },
            { value: "calendar", label: "Календарь" },
          ]}
        />
      </div>

      {view === "calendar" ? (
        <CalendarPanel />
      ) : (
        <>
          <div className="-mx-5 mb-4 flex gap-1.5 overflow-x-auto px-5 pb-0.5">
            {filterOptions.map((opt) => {
              const active = filter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter(opt.value)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
                    active ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                  )}
                >
                  {opt.label}
                  {opt.count > 0 ? (
                    <span className={cn("ml-1.5 tabular", active ? "text-on-ink/70" : "text-faint")}>
                      {opt.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon={<TasksGlyph />}
              title="Список дел на двоих"
              text="Пишите, что нужно сделать. Можно задать повтор — задача вернётся сама."
              action={
                <Button
                  onClick={() => {
                    setEditing(null);
                    setOpen(true);
                  }}
                >
                  Добавить задачу
                </Button>
              }
              footnote="никто никому не начальник — задачу можно вернуть"
            />
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-muted">
              {filter === "done" ? "Закрытых задач пока нет" : "Здесь пусто — переключите фильтр или добавьте задачу"}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onEdit={() => {
                    setEditing(t);
                    setOpen(true);
                  }}
                />
              ))}
            </ul>
          )}
        </>
      )}

      <TaskSheet open={open} onOpenChange={setOpen} editing={editing} />
    </Page>
  );
}

function TaskRow({ task, onEdit }: { task: TaskItem; onEdit: () => void }) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const partners = useAppStore((s) => s.partners);
  const me = useMe();
  const partner = usePartner();
  const currentId = useAppStore((s) => s.currentId);
  const repeat = normalizeRepeat(task.repeat);
  const rLabel = repeatLabel(repeat);

  return (
    <li className="rounded-card bg-surface px-3 py-3 shadow-card">
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={task.done ? "Вернуть" : "Сделано"}
          onClick={() => {
            toggleTask(task.id);
            if (!task.done && repeat !== "none") {
              toast(`Готово · следующее: ${rLabel}`);
            }
          }}
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
            task.done ? "bg-ink text-on-ink" : "ring-1 ring-faint text-transparent",
          )}
        >
          {task.done ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </button>
        <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left">
          <p className={cn("text-[16px] font-semibold leading-snug", task.done && "text-muted line-through")}>
            {task.title}
          </p>
          {task.notes ? (
            <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-soft">{task.notes}</p>
          ) : null}
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted">
            {task.assignee !== "none" ? (
              <span className="inline-flex items-center gap-1">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: partners[task.assignee].color }}
                />
                {partners[task.assignee].name}
              </span>
            ) : (
              <span>Общая</span>
            )}
            {task.dueDate ? (
              <span>до {format(new Date(task.dueDate + "T12:00:00"), "d MMM", { locale: ru })}</span>
            ) : null}
            {rLabel ? (
              <span className="inline-flex items-center gap-0.5">
                <RotateCcw className="size-3" strokeWidth={2} />
                {rLabel}
              </span>
            ) : null}
          </p>
        </button>
      </div>
      {!task.done ? (
        <div className="mt-3 flex flex-wrap gap-1.5 pl-9">
          {task.assignee === "none" ? (
            <>
              <Button
                size="chip"
                variant="secondary"
                onClick={() => {
                  updateTask(task.id, { assignee: currentId });
                  toast(`Задача у ${me.name}`);
                }}
              >
                Взять себе
              </Button>
              <Button
                size="chip"
                variant="ghost"
                onClick={() => {
                  updateTask(task.id, { assignee: otherId(currentId) });
                  toast(`Поставили ${partner.name}`);
                }}
              >
                Партнёру
              </Button>
            </>
          ) : (
            <Button
              size="chip"
              variant="ghost"
              onClick={() => {
                updateTask(task.id, { assignee: "none" });
                toast("Задачу вернули в общие");
              }}
            >
              В общие
            </Button>
          )}
        </div>
      ) : null}
    </li>
  );
}

function TaskSheet({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: TaskItem | null;
}) {
  const addTask = useAppStore((s) => s.addTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const me = useMe();
  const partner = usePartner();
  const currentId = useAppStore((s) => s.currentId);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [assignee, setAssignee] = useState<TaskAssignee>("none");
  const [dueDate, setDueDate] = useState("");
  const [repeat, setRepeat] = useState<TaskRepeat>("none");

  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setNotes(editing?.notes ?? "");
    setAssignee(editing?.assignee ?? "none");
    setDueDate(editing?.dueDate ?? "");
    setRepeat(normalizeRepeat(editing?.repeat ?? "none"));
  }, [open, editing]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={editing ? "Задача" : "Новая задача"}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          if (editing) {
            updateTask(editing.id, {
              title: title.trim(),
              notes,
              assignee,
              dueDate: dueDate || null,
              repeat,
            });
            toast("Сохранили");
          } else {
            addTask({ title, notes, assignee, dueDate: dueDate || null, repeat });
            toast("Задача в списке");
          }
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
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            min={todayISO()}
            placeholder="Без срока"
            allowClear
          />
        </Field>
        <Field label="Повтор">
          <div className="flex flex-wrap gap-1.5">
            {TASK_REPEAT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRepeat(opt.id)}
                className={cn(
                  "h-9 rounded-full px-3 text-[13px] font-semibold",
                  repeat === opt.id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {repeat !== "none" ? (
            <p className="mt-2 text-[12px] text-muted">
              После «готово» задача останется открытой, срок сдвинется вперёд.
            </p>
          ) : null}
        </Field>
        <Button type="submit" className="mt-2">
          {editing ? "Сохранить" : "Добавить задачу"}
        </Button>
        {editing ? (
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
        ) : null}
      </form>
    </Sheet>
  );
}

function TasksGlyph() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden="true">
      <circle cx="14" cy="16" r="10" fill="#D4D0C8" />
      <path
        d="M9.5 16.5l3.2 3.2 6.2-7"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="32" y="13" width="28" height="6" rx="3" fill="#D4D0C8" />
      <circle cx="14" cy="40" r="10" stroke="#D4D0C8" strokeWidth="2.2" />
      <rect x="32" y="37" width="22" height="6" rx="3" fill="#D4D0C8" />
    </svg>
  );
}
