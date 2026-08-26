import type { ExpenseItem, PartnerId } from "./types";

/** Format rubles for display, e.g. 1 250 ₽ */
export function formatRub(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "−" : "";
  const abs = Math.abs(rounded);
  const withSpaces = String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${sign}${withSpaces}\u00a0₽`;
}

/**
 * Positive → partner `b` owes `a` this much.
 * Negative → partner `a` owes `b` this much (absolute value).
 * Zero → even.
 */
export function netBalance(expenses: ExpenseItem[]): number {
  let balance = 0;
  for (const e of expenses) {
    const half = e.amount / 2;
    balance += e.paidBy === "a" ? half : -half;
  }
  return balance;
}

export function parseAmountInput(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

/** Neutral wording without gendered verb. */
export function balanceText(
  balance: number,
  names: Record<PartnerId, string>,
): { headline: string; detail: string; even: boolean } {
  if (Math.abs(balance) < 0.5) {
    return {
      headline: "Поровну",
      detail: "Никто никому не должен",
      even: true,
    };
  }
  if (balance > 0) {
    return {
      headline: formatRub(balance),
      detail: `${names.b} → ${names.a}`,
      even: false,
    };
  }
  return {
    headline: formatRub(-balance),
    detail: `${names.a} → ${names.b}`,
    even: false,
  };
}
