import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import type { ExpenseCategory, ExpenseItem } from "./types";

export const EXPENSE_CATEGORIES: {
  id: ExpenseCategory;
  label: string;
}[] = [
  { id: "groceries", label: "Продукты" },
  { id: "cafes", label: "Заведения" },
  { id: "taxi", label: "Такси" },
  { id: "delivery", label: "Доставка" },
  { id: "home", label: "Дом" },
  { id: "other", label: "Другое" },
];

export function categoryLabel(id: ExpenseCategory | undefined): string {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? "Другое";
}

export function normalizeCategory(value: unknown): ExpenseCategory {
  const ids = EXPENSE_CATEGORIES.map((c) => c.id);
  return ids.includes(value as ExpenseCategory) ? (value as ExpenseCategory) : "other";
}

export function categoryStats(expenses: ExpenseItem[]) {
  const totals = new Map<ExpenseCategory, number>();
  for (const c of EXPENSE_CATEGORIES) totals.set(c.id, 0);
  let sum = 0;
  for (const e of expenses) {
    const cat = normalizeCategory(e.category);
    totals.set(cat, (totals.get(cat) ?? 0) + e.amount);
    sum += e.amount;
  }
  return EXPENSE_CATEGORIES.map((c) => ({
    ...c,
    amount: totals.get(c.id) ?? 0,
    share: sum > 0 ? (totals.get(c.id) ?? 0) / sum : 0,
  })).filter((c) => c.amount > 0);
}

/** Group expenses by calendar month (newest first). */
export function monthlyExpenseStats(expenses: ExpenseItem[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const key = e.date.slice(0, 7); // YYYY-MM
    map.set(key, (map.get(key) ?? 0) + e.amount);
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, amount]) => {
      const label = format(parseISO(`${key}-01`), "LLLL yyyy", { locale: ru });
      return {
        key,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        amount,
      };
    });
}
