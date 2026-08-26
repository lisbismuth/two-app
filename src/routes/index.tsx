import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Check } from "lucide-react";

import { toast } from "sonner";
import { Button, EmptyState, Field, Input, Sheet, Textarea } from "@/components/ui";
import { DatePicker } from "@/components/date-picker";
import { Page, PageHeader } from "@/components/shell";
import { otherId, useAppStore, useMe, usePartner } from "@/lib/store";
import type { TaskAssignee, TaskItem } from "@/lib/types";
import { cn, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: TasksPage });

function TasksPage() {
  const tasks = useAppStore((s) => s.tasks);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const openCount = tasks.filter((t) => !t.done).length;

  return (
    <Page>
      <PageHeader title="Задачи" onAdd={() => { setEditing(null); setOpen(true); }} />
      {tasks.length === 0 ? (
        <EmptyState
          icon={<TasksGlyph />}
          title="Список дел на двоих"
          text="Пишите, что нужно сделать. Любой берёт задачу себе — или ставит её партнёру."
          action={
            <Button onClick={() => { setEditing(null); setOpen(true); }}>Добавить задачу</Button>
          }
          footnote="никто никому не начальник — задачу можно вернуть"
        />
      ) : (
        <div className="flex flex-col gap-6">
          {openCount === 0 ? (
            <p className="text-center text-[14px] text-muted">Все задачи закрыты. Можно выдохнуть.</p>
          ) : null}
          <TaskGroup title="Общие" items={tasks.filter((t) => !t.done && t.assignee === "none")} onEdit={(t) => { setEditing(t); setOpen(true); }} />
          <AssignedGroups onEdit={(t) => { setEditing(t); setOpen(true); }} />
          <TaskGroup title="Сделано" items={tasks.filter((t) => t.done)} muted onEdit={(t) => { setEditing(t); setOpen(true); }} />
        </div>
      )}
      <TaskSheet open={open} onOpenChange={setOpen} editing={editing} />
    </Page>
  );
}

function AssignedGroups({ onEdit }: { onEdit: (t: TaskItem) => void }) {
  const partners = useAppStore((s) => s.partners);
  const tasks = useAppStore((s) => s.tasks);
  return (
    <>
      {(["a", "b"] as const).map((id) => (
        <TaskGroup
          key={id}
          title={partners[id].name}
          accent={partners[id].color}
          items={tasks.filter((t) => !t.done && t.assignee === id)}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}

function TaskGroup({
  title,
  items,
  muted,
  accent,
  onEdit,
}: {
  title: string;
  items: TaskItem[];
  muted?: boolean;
  accent?: string;
  onEdit: (t: TaskItem) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        {accent ? <span className="size-2 rounded-full" style={{ background: accent }} /> : null}
        <h2 className={cn("text-[12px] font-semibold uppercase tracking-[0.12em]", muted ? "text-faint" : "text-muted")}>
          {title}
        </h2>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((t) => (
          <TaskRow key={t.id} task={t} onEdit={() => onEdit(t)} />
        ))}
      </ul>
    </section>
  );
}

function TaskRow({ task, onEdit }: { task: TaskItem; onEdit: () => void }) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const me = useMe();
  const partner = usePartner();
  const currentId = useAppStore((s) => s.currentId);

  return (
    <li className="rounded-card bg-surface px-3 py-3 shadow-card">
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={task.done ? "Вернуть" : "Сделано"}
          onClick={() => toggleTask(task.id)}
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
          {task.dueDate ? (
            <p className="mt-0.5 text-[12px] text-muted">
              до {format(new Date(task.dueDate + "T12:00:00"), "d MMMM", { locale: ru })}
            </p>
          ) : null}
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
              Вернуть
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

  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setNotes(editing?.notes ?? "");
    setAssignee(editing?.assignee ?? "none");
    setDueDate(editing?.dueDate ?? "");
  }, [open, editing]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={editing ? "Задача" : "Новая задача"}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          if (editing) {
            updateTask(editing.id, { title: title.trim(), notes, assignee, dueDate: dueDate || null });
            toast("Сохранили");
          } else {
            addTask({ title, notes, assignee, dueDate: dueDate || null });
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
      <path d="M9.5 16.5l3.2 3.2 6.2-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="32" y="13" width="28" height="6" rx="3" fill="#D4D0C8" />
      <circle cx="14" cy="40" r="10" stroke="#D4D0C8" strokeWidth="2.2" />
      <rect x="32" y="37" width="22" height="6" rx="3" fill="#D4D0C8" />
    </svg>
  );
}
