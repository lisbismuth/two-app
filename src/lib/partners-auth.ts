import type { PartnerId } from "./types";

/**
 * Partner allowlist and display names.
 *
 * Emails come from Vercel env: PARTNER_EMAIL_A / PARTNER_EMAIL_B.
 * Do not put real emails in git.
 *
 * Server reads process.env at runtime. The client bundle cannot see non-VITE_
 * secrets, so vite.config.ts also inlines the same values at build time via
 * `__PARTNER_EMAIL_*__` defines (Vercel injects Production env during `vite build`).
 * Without that, the login form's client-side check always fails with an empty
 * allowlist even when server env is correct.
 *
 * Names stay in code in Russian — Vercel env UI is awkward with Cyrillic.
 * Optional overrides: PARTNER_NAME_A, PARTNER_NAME_B (any language).
 */

declare const __PARTNER_EMAIL_A__: string | undefined;
declare const __PARTNER_EMAIL_B__: string | undefined;
declare const __PARTNER_NAME_A__: string | undefined;
declare const __PARTNER_NAME_B__: string | undefined;

function readDefine(value: string | undefined): string | undefined {
  const v = typeof value === "string" ? value.trim() : "";
  return v ? v : undefined;
}

function env(key: string): string | undefined {
  // 1) Runtime (server / Nitro): real process.env
  const fromProcess =
    process.env[key]?.trim() || process.env[`VITE_${key}`]?.trim();
  if (fromProcess) return fromProcess;

  // 2) Vite client: import.meta.env only exposes VITE_* inlined at build
  try {
    const meta = import.meta.env as Record<string, string | undefined>;
    const fromMeta = meta[key]?.trim() || meta[`VITE_${key}`]?.trim();
    if (fromMeta) return fromMeta;
  } catch {
    /* import.meta unavailable in some CJS paths */
  }

  // 3) Build-time defines from vite.config (PARTNER_EMAIL_* → client bundle)
  if (key === "PARTNER_EMAIL_A") return readDefine(__PARTNER_EMAIL_A__);
  if (key === "PARTNER_EMAIL_B") return readDefine(__PARTNER_EMAIL_B__);
  if (key === "PARTNER_NAME_A") return readDefine(__PARTNER_NAME_A__);
  if (key === "PARTNER_NAME_B") return readDefine(__PARTNER_NAME_B__);

  return undefined;
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
