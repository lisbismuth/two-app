/**
 * Server-backed shared state for the couple's app data — the actual source
 * of truth now, replacing the earlier P2P-only approach (kept as a single
 * row via migrations/0001_app_state.sql; see that file for why one row).
 * One document, read/written whole. Client side: ./client.ts.
 *
 * Optimistic concurrency: PUT accepts `expectedUpdatedAt`, the client's
 * last-known server timestamp. If the stored row has moved on since then —
 * the partner wrote first — the write is rejected (409) with the current
 * row attached, so the caller reconciles instead of silently overwriting a
 * change it never saw. Implemented as one atomic statement (INSERT ...
 * ON CONFLICT ... DO UPDATE ... WHERE) rather than a transaction, because
 * the shared `Sql` surface in @/lib/db doesn't expose a single reserved
 * connection to run BEGIN/COMMIT across statements — see that file.
 */
import { z } from "zod";
import { getSql } from "../db.ts";

const putSchema = z.object({
  data: z.record(z.string(), z.unknown()),
  updatedAt: z.number().int().nonnegative(),
  // Omitted or null: force-write, no conflict check (first-ever seed).
  expectedUpdatedAt: z.number().int().nonnegative().nullable().optional(),
});

interface StateRow {
  data: unknown;
  updated_at: number;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function handleGet(): Promise<Response> {
  const sql = await getSql();
  const rows = await sql.query<StateRow>("SELECT data, updated_at FROM app_state WHERE id = 1");
  if (rows.length === 0) return json({ data: null, updatedAt: null });
  return json({ data: rows[0].data, updatedAt: rows[0].updated_at });
}

async function handlePut(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid request" }, 400);
  const { data, updatedAt, expectedUpdatedAt } = parsed.data;

  const sql = await getSql();
  const rows = await sql.query<StateRow>(
    `INSERT INTO app_state (id, data, updated_at)
     VALUES (1, $1::jsonb, $2)
     ON CONFLICT (id) DO UPDATE SET
       data = EXCLUDED.data,
       updated_at = EXCLUDED.updated_at
     WHERE $3::bigint IS NULL OR app_state.updated_at = $3::bigint
     RETURNING data, updated_at`,
    [JSON.stringify(data), updatedAt, expectedUpdatedAt ?? null],
  );

  if (rows.length === 0) {
    // A row exists but didn't match expectedUpdatedAt — the partner wrote
    // first. Hand back the current row instead of failing blind.
    const current = await sql.query<StateRow>(
      "SELECT data, updated_at FROM app_state WHERE id = 1",
    );
    return json(
      {
        error: "conflict",
        data: current[0]?.data ?? null,
        updatedAt: current[0]?.updated_at ?? null,
      },
      409,
    );
  }

  return json({ data: rows[0].data, updatedAt: rows[0].updated_at });
}

/** Request entrypoint for the /api/state route (GET read, PUT write). */
export async function handleState(request: Request): Promise<Response> {
  try {
    if (request.method === "GET") return await handleGet();
    if (request.method === "PUT") return await handlePut(request);
    return json({ error: "method not allowed" }, 405);
  } catch (error) {
    console.error("[state] error:", error);
    return json({ error: "internal error" }, 500);
  }
}
