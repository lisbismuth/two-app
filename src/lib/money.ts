import type { ExpenseItem, Gender, PartnerId } from "./types";

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
 * Settled expenses do not affect the balance.
 */
export function netBalance(expenses: ExpenseItem[]): number {
  let balance = 0;
  for (const e of expenses) {
    if (e.settled) continue;
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

function owesVerb(gender: Gender | undefined): string {
  if (gender === "female") return "должна";
  if (gender === "male") return "должен";
  return "должен(а)";
}

/**
 * Clear wording: "Андрей должен Лизе" — who owes whom, no arrows.
 * `headline` is the amount; `detail` is the full sentence.
 */
export function balanceText(
  balance: number,
  names: Record<PartnerId, string>,
  genders?: Partial<Record<PartnerId, Gender>>,
): { headline: string; detail: string; even: boolean } {
  if (Math.abs(balance) < 0.5) {
    return {
      headline: "Поровну",
      detail: "Никто никому не должен",
      even: true,
    };
  }
  // balance > 0 → b owes a; balance < 0 → a owes b
  const debtor: PartnerId = balance > 0 ? "b" : "a";
  const creditor: PartnerId = balance > 0 ? "a" : "b";
  const amount = Math.abs(balance);
  const verb = owesVerb(genders?.[debtor]);
  return {
    headline: formatRub(amount),
    detail: `${names[debtor]} ${verb} ${names[creditor]}`,
    even: false,
  };
}
