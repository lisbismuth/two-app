import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Folder, Gift, Heart, ListTodo, Plus, Wallet } from "lucide-react";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useAppStore, useMe } from "@/lib/store";
import { useServerSync } from "@/lib/sync/client";
import { Setup } from "@/components/setup";
import { PartnerSwitcher } from "@/components/partners";
import { authEnabled } from "@/lib/auth/client";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SIGN_IN_PATH } from "@/lib/auth/gates";
import { partnerIdFromEmail } from "@/lib/partners-auth";

const TABS = [
  { to: "/", label: "Задачи", icon: ListTodo, end: true },
  { to: "/calendar", label: "Календарь", icon: CalendarDays, end: false },
  { to: "/expenses", label: "Траты", icon: Wallet, end: false },
  { to: "/wishes", label: "Хотелки", icon: Gift, end: false },
  { to: "/us", label: "Мы", icon: Heart, end: false },
] as const;

export function HydrationGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setReady(true));
    if (useAppStore.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);

  if (!ready) return <Splash />;
  return children;
}

function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <p className="text-3xl font-extrabold tracking-tight text-ink">Двое</p>
    </div>
  );
}

/** Keep in-app partner (Лиза / Андрей) in sync with the signed-in email. */
function PartnerFromAuth() {
  const { user } = useCurrentUserState();
  const currentId = useAppStore((s) => s.currentId);
  const setCurrentId = useAppStore((s) => s.setCurrentId);

  useEffect(() => {
    const partnerId = partnerIdFromEmail(user?.primaryEmail);
    if (partnerId && partnerId !== currentId) {
      setCurrentId(partnerId);
    }
  }, [user?.primaryEmail, currentId, setCurrentId]);

  return null;
}

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === SIGN_IN_PATH || pathname.startsWith("/login");
  const { user, isPending } = useCurrentUserState();
  const setupComplete = useAppStore((s) => s.setupComplete);
  useServerSync();

  // Login page is outside the app chrome and auth gate.
  if (isLogin) {
    return (
      <>
        <Outlet />
        <Toaster
          position="top-center"
          offset={16}
          toastOptions={{
            className:
              "!bg-ink !text-on-ink !rounded-full !px-4 !py-3 !font-[Manrope] !text-sm !shadow-float",
          }}
        />
      </>
    );
  }

  // Require sign-in when auth is enabled.
  if (authEnabled) {
    if (isPending) return <Splash />;
    if (!user) return <RedirectToSignIn />;
  }

  return (
    <HydrationGate>
      <PartnerFromAuth />
      <div className="flex min-h-dvh justify-center bg-bg-warm">
        <div className="relative flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden bg-bg sm:shadow-float">
          {setupComplete ? (
            <>
              <Outlet />
              <TabBar />
            </>
          ) : (
            <Setup />
          )}
        </div>
      </div>
      <Toaster
        position="top-center"
        offset={16}
        toastOptions={{
          className:
            "!bg-ink !text-on-ink !rounded-full !px-4 !py-3 !font-[Manrope] !text-sm !shadow-float",
        }}
      />
    </HydrationGate>
  );
}

function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky bottom-0 z-30 mt-auto border-t border-line bg-bg pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5">
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = tab.end ? pathname === "/" : pathname.startsWith(tab.to);
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors duration-150",
                  active ? "text-ink" : "text-faint",
                )}
              >
                <Icon
                  className="size-[22px]"
                  strokeWidth={active ? 2.2 : 1.7}
                  fill={tab.to === "/us" && active ? "currentColor" : "none"}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("flex flex-1 flex-col px-5 pt-3 pb-4", className)}>{children}</main>
  );
}

export function PageHeader({
  kicker,
  title,
  onAdd,
  addLabel = "Добавить",
  avatar,
  extra,
  kickerUpper = true,
}: {
  kicker?: string;
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  avatar?: boolean;
  extra?: ReactNode;
  kickerUpper?: boolean;
}) {
  return (
    <header className="mb-5 pt-1">
      {kicker ? (
        <p
          className={cn(
            "mb-2 text-[12px] font-medium text-muted",
            kickerUpper && "uppercase tracking-[0.14em]",
          )}
        >
          {kicker}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <h1 className="shrink-0 text-[32px] font-extrabold leading-none tracking-tight text-ink">{title}</h1>
        <div className="flex shrink-0 items-center gap-1">
          {extra}
          {onAdd ? (
            <button
              type="button"
              onClick={onAdd}
              aria-label={addLabel}
              className="flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-plus transition-transform duration-150 active:scale-[0.96]"
            >
              <Plus className="size-5" strokeWidth={2.2} />
            </button>
          ) : null}
          {avatar ? <HeaderAvatar /> : null}
        </div>
      </div>
    </header>
  );
}

function HeaderAvatar() {
  const me = useMe();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Профиль"
        className="size-11 rounded-full transition-transform duration-150 active:scale-[0.96]"
        style={{ background: me.color }}
      />
      <PartnerSwitcher open={open} onOpenChange={setOpen} />
    </>
  );
}

/** Compact account chip for the partner sheet / settings. */
export function AccountRow() {
  if (!authEnabled) return null;
  return (
    <div className="rounded-card bg-chip px-3 py-3">
      <UserButton />
    </div>
  );
}

/** Re-export so Us page can deep-link to docs without a tab. */
export const DOCS_TAB = { to: "/docs" as const, label: "Документы", icon: Folder };
