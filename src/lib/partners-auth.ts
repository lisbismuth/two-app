import type { PartnerId } from "./types";

/**
 * Partner allowlist and display names.
 *
 * Emails come from server env (Vercel): PARTNER_EMAIL_A, PARTNER_EMAIL_B.
 * Do not put real emails in git.
 *
 * Names stay in code in Russian — Vercel env UI is awkward with Cyrillic.
 * Optional overrides: PARTNER_NAME_A, PARTNER_NAME_B (any language).
 */

function env(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

function buildPartnerByEmail(): Record<string, PartnerId> {
  const map: Record<string, PartnerId> = {};
  const a = env("PARTNER_EMAIL_A")?.toLowerCase();
  const b = env("PARTNER_EMAIL_B")?.toLowerCase();
  if (a) map[a] = "a";
  if (b) map[b] = "b";
  return map;
}

/** Built at module load from env. Empty map if env not set (nobody can register). */
export const PARTNER_BY_EMAIL: Record<string, PartnerId> = buildPartnerByEmail();

export const ALLOWED_EMAILS = Object.keys(PARTNER_BY_EMAIL);

export const PARTNER_DISPLAY_NAME: Record<PartnerId, string> = {
  a: env("PARTNER_NAME_A") ?? "Лиза",
  b: env("PARTNER_NAME_B") ?? "Андрей",
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowedEmail(email: string): boolean {
  const map = PARTNER_BY_EMAIL;
  if (Object.keys(map).length === 0) {
    // Fail closed when allowlist is empty (env not configured).
    return false;
  }
  return normalizeEmail(email) in map;
}

export function partnerIdFromEmail(email: string | null | undefined): PartnerId | null {
  if (!email) return null;
  return PARTNER_BY_EMAIL[normalizeEmail(email)] ?? null;
}
