import type { PartnerId } from "./types";
import { normalizeEmail } from "./email-normalize";

/**
 * Partner allowlist check — CLIENT SAFE.
 *
 * The server is the real gate (`partners-auth.ts` + the Better Auth hooks in
 * `auth/server.ts`); this module only powers the login form's instant "wrong
 * email" message before a round trip to the server. A rejection here is
 * purely UX — the server re-checks independently and is what actually
 * decides who gets in.
 *
 * To keep real email addresses out of the public JS bundle, vite.config.ts
 * inlines a SHA-256 hash of each normalized (trimmed, lowercased) partner
 * email — never the email itself — via `__PARTNER_EMAIL_HASH_A__` /
 * `__PARTNER_EMAIL_HASH_B__`. Anyone reading the deployed bundle sees a hash,
 * not an address.
 */

declare const __PARTNER_EMAIL_HASH_A__: string | undefined;
declare const __PARTNER_EMAIL_HASH_B__: string | undefined;
declare const __PARTNER_NAME_A__: string | undefined;
declare const __PARTNER_NAME_B__: string | undefined;

function readDefine(value: string | undefined): string | undefined {
  const v = typeof value === "string" ? value.trim() : "";
  return v ? v : undefined;
}

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const HASH_BY_PARTNER: Partial<Record<PartnerId, string>> = {
  a: readDefine(__PARTNER_EMAIL_HASH_A__),
  b: readDefine(__PARTNER_EMAIL_HASH_B__),
};

export const PARTNER_DISPLAY_NAME: Record<PartnerId, string> = {
  a: readDefine(__PARTNER_NAME_A__) ?? "Лиза",
  b: readDefine(__PARTNER_NAME_B__) ?? "Андрей",
};

/**
 * Which partner (if any) a normalized email hashes to. Resolves to `null`
 * for anyone outside the pair, or if the build has no hashes at all (e.g.
 * local dev without the env vars set — the server still fails closed).
 */
export async function partnerIdFromEmailClient(
  email: string | null | undefined,
): Promise<PartnerId | null> {
  if (!email) return null;
  const hash = await sha256Hex(normalizeEmail(email));
  for (const [partnerId, expected] of Object.entries(HASH_BY_PARTNER) as Array<
    [PartnerId, string | undefined]
  >) {
    if (expected && expected === hash) return partnerId;
  }
  return null;
}

export async function isAllowedEmailClient(email: string): Promise<boolean> {
  return (await partnerIdFromEmailClient(email)) !== null;
}

export { normalizeEmail };
