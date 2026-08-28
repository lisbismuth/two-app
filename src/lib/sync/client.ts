/**
 * Polls /api/state so both partners see the same data.
 * Auth: same-origin cookies + optional live-preview bearer.
 * Guest mode: no network sync (local demo only).
 */
import { useEffect, useRef, useState } from "react";
import { getBearerToken } from "@/lib/auth/client";
import { isGuestMode } from "@/lib/guest";
import { useAppStore } from "@/lib/store";

const POLL_MS = 8000;
const PUSH_DEBOUNCE_MS = 400;

const SYNCED_KEYS = [
  "tasks",
  "events",
  "wishes",
  "plans",
  "docs",
  "capsules",
  "votes",
  "expenses",
  "partners",
  "startedAt",
] as const satisfies readonly (keyof ReturnType<typeof useAppStore.getState>)[];

const ARRAY_DEFAULTS = [
  "tasks",
  "events",
  "wishes",
  "plans",
  "docs",
  "capsules",
  "votes",
  "expenses",
] as const;

type FullState = ReturnType<typeof useAppStore.getState>;
type SyncedSlice = Pick<FullState, (typeof SYNCED_KEYS)[number]>;

interface StateResponse {
  data: SyncedSlice | null;
  updatedAt: number | null;
  error?: string;
}

function pickSyncedSlice(state: FullState): SyncedSlice {
  const out = {} as SyncedSlice;
  for (const key of SYNCED_KEYS) {
    (out as Record<string, unknown>)[key] = state[key];
  }
  return out;
}

function normalizeDoc(raw: unknown): Record<string, unknown> {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    ...d,
    notes: typeof d.notes === "string" ? d.notes : "",
    mime: typeof d.mime === "string" ? d.mime : "",
    dataUrl: typeof d.dataUrl === "string" ? d.dataUrl : "",
    logoUrl: typeof d.logoUrl === "string" ? d.logoUrl : "",
    codeValue: typeof d.codeValue === "string" ? d.codeValue : "",
    codeFormat: typeof d.codeFormat === "string" ? d.codeFormat : "",
  };
}

function normalizeRemote(data: SyncedSlice): SyncedSlice {
  const next = { ...data } as SyncedSlice & Record<string, unknown>;
  for (const key of ARRAY_DEFAULTS) {
    if (!Array.isArray(next[key])) next[key] = [];
  }
  if (Array.isArray(next.docs)) {
    next.docs = next.docs.map(normalizeDoc) as typeof next.docs;
  }
  if (Array.isArray(next.tasks)) {
    next.tasks = next.tasks.map((t) => {
      const row = t as Record<string, unknown>;
      return {
        ...row,
        repeat: typeof row.repeat === "string" ? row.repeat : "none",
      };
    }) as typeof next.tasks;
  }
  return next;
}

function stateFetchInit(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.method === "PUT") {
    headers.set("content-type", "application/json");
  }
  const token = getBearerToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return {
    ...init,
    credentials: "include",
    headers,
  };
}

export function useServerSync(): void {
  const setupComplete = useAppStore((s) => s.setupComplete);
  const [hydrated, setHydrated] = useState(false);
  const applyingRemote = useRef(false);
  const lastKnownUpdatedAt = useRef<number | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pullInFlight = useRef(false);

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated || !setupComplete) return;
    if (isGuestMode()) return;

    let cancelled = false;

    function applyRemote(data: SyncedSlice, updatedAt: number | null) {
      lastKnownUpdatedAt.current = updatedAt;
      applyingRemote.current = true;
      useAppStore.setState(normalizeRemote(data));
      applyingRemote.current = false;
    }

    async function push(seed: boolean): Promise<void> {
      if (isGuestMode()) return;
      const updatedAt = Date.now();
      const state = pickSyncedSlice(useAppStore.getState());
      try {
        const res = await fetch(
          "/api/state",
          stateFetchInit({
            method: "PUT",
            body: JSON.stringify({
              data: state,
              updatedAt,
              expectedUpdatedAt: seed ? null : lastKnownUpdatedAt.current,
            }),
          }),
        );
        if (res.status === 401) return;
        const responseBody = (await res.json()) as StateResponse;
        if (res.status === 409 && responseBody.data) {
          applyRemote(responseBody.data, responseBody.updatedAt);
          return;
        }
        if (res.ok) lastKnownUpdatedAt.current = responseBody.updatedAt;
      } catch {
        /* offline */
      }
    }

    async function pull(): Promise<void> {
      if (isGuestMode()) return;
      if (pullInFlight.current) return;
      pullInFlight.current = true;
      try {
        const res = await fetch("/api/state", stateFetchInit({ method: "GET" }));
        if (res.status === 401 || !res.ok || cancelled) return;
        const body = (await res.json()) as StateResponse;
        if (body.data === null) {
          await push(true);
          return;
        }
        if (body.updatedAt === lastKnownUpdatedAt.current) return;
        applyRemote(body.data, body.updatedAt);
      } catch {
        /* offline */
      } finally {
        pullInFlight.current = false;
      }
    }

    void pull();
    const interval = setInterval(() => void pull(), POLL_MS);

    const onFocus = () => void pull();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void pull();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    const unsubscribe = useAppStore.subscribe((state, prevState) => {
      if (applyingRemote.current) return;
      if (isGuestMode()) return;
      const changed = SYNCED_KEYS.some((key) => state[key] !== prevState[key]);
      if (!changed) return;
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => void push(false), PUSH_DEBOUNCE_MS);
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      unsubscribe();
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [hydrated, setupComplete]);
}
