/**
 * Polls /api/state (see ./state.server) so both people see the same data
 * without needing to have the app open at the same moment — this is what
 * replaced the earlier P2P-only approach. Same whole-slice "last write
 * wins" trade-off as before, now backed by Postgres instead of an
 * ephemeral WebRTC channel, plus one safety net the P2P version didn't
 * have: a write that would clobber a change it never saw gets rejected
 * and reconciled instead of silently overwriting it (see push() below).
 *
 * Local writes still land in localStorage immediately via zustand's
 * `persist` (unchanged) — this hook only adds a background layer that
 * reads/writes the same slice to the server. Offline: nothing is lost,
 * the next successful poll or the debounced push after the next edit
 * picks it back up.
 */
import { useEffect, useRef, useState } from "react";
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

/**
 * Call once, near the app root, after local persisted state has hydrated
 * (mirrors the earlier useP2PSync gating — see git history if you need the
 * P2P version back). No-op until setup is complete, so we never push an
 * empty pre-setup snapshot over real data already on the server.
 */
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
    let cancelled = false;

    function applyRemote(data: SyncedSlice, updatedAt: number | null) {
      lastKnownUpdatedAt.current = updatedAt;
      applyingRemote.current = true;
      useAppStore.setState(data);
      applyingRemote.current = false;
    }

    async function push(seed: boolean): Promise<void> {
      const updatedAt = Date.now();
      const state = pickSyncedSlice(useAppStore.getState());
      try {
        const res = await fetch("/api/state", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            data: state,
            updatedAt,
            expectedUpdatedAt: seed ? null : lastKnownUpdatedAt.current,
          }),
        });
        const responseBody = (await res.json()) as StateResponse;
        if (res.status === 409 && responseBody.data) {
          // The partner wrote in between. For two people this is rare —
          // adopt their version rather than build real merge logic for it.
          applyRemote(responseBody.data, responseBody.updatedAt);
          return;
        }
        if (res.ok) lastKnownUpdatedAt.current = responseBody.updatedAt;
      } catch {
        // Offline — the next poll (which re-seeds if the server still has
        // nothing) or the next debounced push after another local edit
        // will retry. Nothing is lost locally.
      }
    }

    async function pull(): Promise<void> {
      if (pullInFlight.current) return;
      pullInFlight.current = true;
      try {
        const res = await fetch("/api/state");
        if (!res.ok || cancelled) return;
        const body = (await res.json()) as StateResponse;
        if (body.data === null) {
          // Nothing on the server yet — this device seeds it.
          await push(true);
          return;
        }
        if (body.updatedAt === lastKnownUpdatedAt.current) return; // nothing new
        applyRemote(body.data, body.updatedAt);
      } catch {
        // Offline — local data (already in localStorage) is unaffected;
        // the next interval tick retries.
      } finally {
        pullInFlight.current = false;
      }
    }

    void pull();
    const interval = setInterval(() => void pull(), POLL_MS);

    // Catch up immediately on reopen, rather than waiting out the poll
    // interval — this is most of what actually fixes the "must both be
    // online at once" problem in daily use.
    const onFocus = () => void pull();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void pull();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    const unsubscribe = useAppStore.subscribe((state, prevState) => {
      if (applyingRemote.current) return; // don't echo back what we just received
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
