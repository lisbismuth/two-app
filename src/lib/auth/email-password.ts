/**
 * Local email/password sign-in (this app's Better Auth DB — not the broker).
 *
 * Only the two partner emails in `src/lib/partners-auth.ts` may register or sign in.
 * Server rejects everyone else via databaseHooks in `server.ts`.
 */
export const emailAndPasswordEnabled = true;

/** Passed into Better Auth when email/password is on. */
export const emailAndPasswordOptions = {
  enabled: true as const,
  /** Registration stays open only for the two allowlisted emails. */
  disableSignUp: false,
};
