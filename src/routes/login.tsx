import { useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button, Field, Input } from "@/components/ui";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!authEnabled) {
    return <Navigate to="/" />;
  }

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <p className="text-3xl font-extrabold tracking-tight text-ink">Двое</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0] || "Партнёр",
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (err) throw new Error(err.message ?? "Не удалось зарегистрироваться");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (err) throw new Error(err.message ?? "Неверный email или пароль");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh justify-center bg-bg-warm">
      <div className="flex min-h-dvh w-full max-w-lg flex-col justify-center bg-bg px-6 py-10 sm:shadow-float">
        <div className="rise-in mb-10 text-center">
          <p className="text-3xl font-extrabold tracking-tight text-ink">Двое</p>
          <p className="mt-2 text-[15px] text-muted">
            {mode === "signin" ? "Войдите, чтобы продолжить" : "Создайте аккаунт для двоих"}
          </p>
        </div>

        <form className="rise-in rise-in-1 flex flex-col gap-4" onSubmit={onSubmit}>
          {mode === "signup" ? (
            <Field label="Имя">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться"
                autoComplete="name"
              />
            </Field>
          ) : null}
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>
          <Field label="Пароль">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Минимум 8 символов" : "Ваш пароль"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </Field>

          {error ? (
            <p className="rounded-control bg-danger/10 px-3 py-2 text-[14px] text-danger">{error}</p>
          ) : null}

          <Button type="submit" disabled={busy} className="mt-2">
            {busy ? "Секунду…" : mode === "signin" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="rise-in rise-in-2 mt-6 text-center text-[14px] text-muted">
          {mode === "signin" ? (
            <>
              Ещё нет аккаунта?{" "}
              <button
                type="button"
                className="font-semibold text-ink underline-offset-4 hover:underline"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
              >
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <button
                type="button"
                className="font-semibold text-ink underline-offset-4 hover:underline"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
              >
                Войти
              </button>
            </>
          )}
        </p>

        <p className="mt-8 text-center text-[12px] uppercase tracking-[0.08em] text-faint">
          Только для вас двоих
        </p>
      </div>
    </div>
  );
}
