/**
 * Local email/password sign-in (this app's Better Auth DB — not the broker).
 *
 * Enabled for the couple app. Forms use `authClient.signUp.email` /
 * `authClient.signIn.email` from `@/lib/auth/client`.
 *
 * After both partners have accounts, set `disableSignUp: true` below so nobody
 * else can register.
 */
export const emailAndPasswordEnabled = true;

/** Passed into Better Auth when email/password is on. */
export const emailAndPasswordOptions = {
  enabled: true as const,
  /** Set to true once both of you have signed up — blocks further registration. */
  disableSignUp: false,
};
