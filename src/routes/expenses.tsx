import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button, EmptyState, Field, Input, Sheet, Textarea } from "@/components/ui";
import { DatePicker } from "@/components/date-picker";
import { Page, PageHeader } from "@/components/shell";
import {
  EXPENSE_CATEGORIES,
  categoryLabel,
  categoryStats,
  normalizeCategory,
} from "@/lib/expense-categories";
import { balanceText, formatRub, netBalance, parseAmountInput } from "@/lib/money";
import { useAppStore } from "@/lib/store";
import type { ExpenseCategory, ExpenseItem, PartnerId } from "@/lib/types";
import { cn, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/expenses")({ component: ExpensesPage });

function ExpensesPage() {
  const expenses = useAppStore((s) => s.expenses);
  const partners = useAppStore((s) => s.partners);
  const settleBalance = useAppStore((s) => s.settleBalance);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseItem | null>(null);

  const sorted = useMemo(
    () =>
      [...expenses].sort(
        (a, b) =>
          Number(!!a.settled) - Number(!!b.settled) ||
          b.date.localeCompare(a.date) ||
          b.createdAt.localeCompare(a.createdAt),
      ),
    [expenses],
  );

  const balance = netBalance(expenses);
  const bal = balanceText(
    balance,
    { a: partners.a.name, b: partners.b.name },
    { a: partners.a.gender, b: partners.b.gender },
  );

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const stats = useMemo(() => categoryStats(expenses), [expenses]);

  return (
    <Page>
      <PageHeader
        title="Траты"
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />

      <div className="mb-4 rounded-card bg-surface px-5 py-5 shadow-card">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Баланс</p>
        <p className="mt-2 text-[36px] font-extrabold leading-none tracking-tight tabular">
          {bal.headline}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-ink">{bal.detail}</p>
        {total > 0 ? (
          <p className="mt-3 text-[13px] text-faint">Всего общих покупок: {formatRub(total)}</p>
        ) : null}
        {!bal.even ? (
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => {
              settleBalance();
              toast("Долг погашен — баланс обнулён");
            }}
          >
            Погасили
          </Button>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <div className="mb-5 rounded-card bg-surface px-4 py-4 shadow-card">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
            По категориям
          </p>
          <ul className="flex flex-col gap-3">
            {stats.map((s) => (
              <li key={s.id}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold">{s.label}</span>
                  <span className="text-[14px] font-bold tabular">{formatRub(s.amount)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-chip">
                  <div
                    className="h-full rounded-full bg-rose"
                    style={{ width: `${Math.max(4, Math.round(s.share * 100))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Wallet className="size-16" strokeWidth={1.2} />}
          title="Общие траты"
          text="Продукты, быт, такси — запишите сумму и категорию. Делится пополам само."
          action={
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Добавить трату
            </Button>
          }
          footnote="вместо переписок в чате"
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((e) => (
            <ExpenseRow
              key={e.id}
              expense={e}
              onEdit={() => {
                setEditing(e);
                setOpen(true);
              }}
            />
          ))}
        </ul>
      )}

      <ExpenseSheet
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        editing={editing}
      />
    </Page>
  );
}

function ExpenseRow({ expense, onEdit }: { expense: ExpenseItem; onEdit: () => void }) {
  const partners = useAppStore((s) => s.partners);
  const payer = partners[expense.paidBy];
  const half = expense.amount / 2;
  const cat = categoryLabel(normalizeCategory(expense.category));
  const settled = !!expense.settled;

  return (
    <li>
      <button
        type="button"
        onClick={onEdit}
        className={cn(
          "flex w-full items-center gap-3 rounded-card bg-surface px-4 py-3.5 text-left shadow-card transition-transform duration-150 active:scale-[0.98]",
          settled && "opacity-55",
        )}
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-on-ink"
          style={{ background: payer.color }}
          aria-hidden
        >
          {payer.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-[16px] font-bold", settled && "line-through")}>
            {expense.title}
          </span>
          <span className="mt-0.5 block text-[13px] text-muted">
            {settled ? "погашено · " : ""}
            {cat}
            {" · "}{format(new Date(expense.date + "T12:00:00"), "d MMM", { locale: ru })}
            {" · "}{payer.name}
            {" · по "}{formatRub(half)}
          </span>
        </span>
        <span className="shrink-0 text-[16px] font-extrabold tabular">{formatRub(expense.amount)}</span>
      </button>
    </li>
  );
}

function ExpenseSheet({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: ExpenseItem | null;
}) {
  const addExpense = useAppStore((s) => s.addExpense);
  const updateExpense = useAppStore((s) => s.updateExpense);
  const deleteExpense = useAppStore((s) => s.deleteExpense);
  const partners = useAppStore((s) => s.partners);
  const currentId = useAppStore((s) => s.currentId);

  const [title, setTitle] = useState("");
  const [amountRaw, setAmountRaw] = useState("");
  const [paidBy, setPaidBy] = useState<PartnerId>(currentId);
  const [category, setCategory] = useState<ExpenseCategory>("groceries");
  const [date, setDate] = useState(todayISO());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setAmountRaw(editing ? String(editing.amount) : "");
    setPaidBy(editing?.paidBy ?? currentId);
    setCategory(normalizeCategory(editing?.category ?? "groceries"));
    setDate(editing?.date ?? todayISO());
    setNotes(editing?.notes ?? "");
  }, [open, editing, currentId]);

  const amount = parseAmountInput(amountRaw);
  const half = amount ? amount / 2 : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={editing ? "Трата" : "Новая трата"}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!amount) {
            toast("Укажите сумму");
            return;
          }
          if (editing) {
            updateExpense(editing.id, {
              title: title.trim() || "Покупка",
              amount,
              paidBy,
              category,
              date,
              notes,
            });
            toast("Сохранили");
          } else {
            addExpense({
              title: title.trim() || "Покупка",
              amount,
              paidBy,
              category,
              date,
              notes,
            });
            toast(`Записали · по ${formatRub(amount / 2)}`);
          }
          onOpenChange(false);
        }}
      >
        <Field label="На что">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Продукты, быт, такси…"
          />
        </Field>
        <Field label="Сумма, ₽">
          <Input
            value={amountRaw}
            onChange={(e) => setAmountRaw(e.target.value)}
            placeholder="0"
            inputMode="decimal"
            required
          />
        </Field>
        {half ? (
          <p className="-mt-2 px-1 text-[13px] text-muted">Каждый по {formatRub(half)}</p>
        ) : null}
        <Field label="Категория">
          <div className="flex flex-wrap gap-1.5">
            {EXPENSE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "h-9 rounded-full px-3 text-[13px] font-semibold",
                  category === c.id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Кто заплатил">
          <div className="grid grid-cols-2 gap-1.5">
            {(["a", "b"] as PartnerId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaidBy(id)}
                className={cn(
                  "h-11 rounded-full text-[13px] font-semibold",
                  paidBy === id ? "bg-ink text-on-ink" : "bg-chip text-ink-soft",
                )}
              >
                {partners[id].name}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Дата">
          <DatePicker value={date} onChange={setDate} />
        </Field>
        <Field label="Заметка">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Необязательно"
            rows={2}
          />
        </Field>
        <Button type="submit" className="mt-2">
          {editing ? "Сохранить" : "Добавить"}
        </Button>
        {editing && !editing.settled ? (
          <Button
            variant="secondary"
            onClick={() => {
              updateExpense(editing.id, { settled: true });
              toast("Трата погашена");
              onOpenChange(false);
            }}
          >
            Погасить эту трату
          </Button>
        ) : null}
        {editing && editing.settled ? (
          <Button
            variant="secondary"
            onClick={() => {
              updateExpense(editing.id, { settled: false });
              toast("Вернули в открытый долг");
              onOpenChange(false);
            }}
          >
            Вернуть в долг
          </Button>
        ) : null}
        {editing ? (
          <Button
            variant="ghost"
            onClick={() => {
              deleteExpense(editing.id);
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
