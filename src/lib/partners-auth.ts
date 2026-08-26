import type { PartnerId } from "./types";

/**
 * Hardcoded couple accounts: only these emails may sign in / sign up.
 * Email → in-app partner (Лиза = a, Андрей = b).
 */
export const PARTNER_BY_EMAIL: Record<string, PartnerId> = {
  "lis.gu@icloud.com": "a",
  "79502467020@mail.ru": "b",
};

export const ALLOWED_EMAILS = Object.keys(PARTNER_BY_EMAIL);

export const PARTNER_DISPLAY_NAME: Record<PartnerId, string> = {
  a: "Лиза",
  b: "Андрей",
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowedEmail(email: string): boolean {
  return normalizeEmail(email) in PARTNER_BY_EMAIL;
}

export function partnerIdFromEmail(email: string | null | undefined): PartnerId | null {
  if (!email) return null;
  return PARTNER_BY_EMAIL[normalizeEmail(email)] ?? null;
}
