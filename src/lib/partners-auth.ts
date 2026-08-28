import type { PartnerId } from "./types";

/**
 * Couple accounts: only these emails may sign in / sign up.
 * Email → partner id (a / b).
 *
 * Before making the repo public, move real emails to Vercel env
 * (see README / instructions). Do not commit personal addresses.
 */
export const PARTNER_BY_EMAIL: Record<string, PartnerId> = {
  "lis.gu@icloud.com": "a",
  "79502467020@mail.ru": "b",
};

export const ALLOWED_EMAILS = Object.keys(PARTNER_BY_EMAIL);

/** Placeholder names in source; live names can still live in synced store / DB. */
export const PARTNER_DISPLAY_NAME: Record<PartnerId, string> = {
  a: "Аня",
  b: "Игорь",
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
