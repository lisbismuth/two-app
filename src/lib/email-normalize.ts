/** Shared by both the server allowlist and the client-side hash check. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
