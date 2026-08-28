/**
 * Server-backed shared state for the couple's app data.
 * GET/PUT require a signed-in allowlisted partner — never public.
 */
import { z } from "zod";
import { auth, authConfigured } from "../auth/server";
import { isAllowedEmail } from "../partners-auth";
import { getSql } from "../db.ts";

/** Reject oversized JSON (photos/logos as data URLs can be large but bounded). */
const MAX_BODY_BYTES = 4_500_000;

const putSchema = z.object({
  data: z.record(z.string(), z.unknown()),
  updatedAt: z.number().int().nonnegative(),
  expectedUpdatedAt: z.number().int().nonnegative().nullable().optional(),
});

interface StateRow {
  data: unknown;
  updated_at: number;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

/**
 * Only the two partner emails may read/write shared state.
 * Uses session cookie or Authorization: Bearer (live preview).
 */
async function requirePartnerSession(request: Request): Promise<Response | null> {
  // When auth is intentionally off and there is no real DB, allow local/dev
  // (same contract as requireUserId). Production always has DATABASE_URL + auth.
  const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());
  if (!authConfigured && !databaseConfigured) return null;

  const session = await auth.api.getSession({ headers: request.headers });
  const email = session?.user?.email;
  if (!session?.user || !email || !isAllowedEmail(email)) {
    return json({ error: "unauthorized" }, 401);
  }
  return null;
}

async function handleGet(): Promise<Response> {
  const sql = await getSql();
  const rows = await sql.query<StateRow>("SELECT data, updated_at FROM app_state WHERE id = 1");
  if (rows.length === 0) return json({ data: null, updatedAt: null });
  return json({ data: rows[0].data, updatedAt: rows[0].updated_at });
}

async function handlePut(request: Request): Promise<Response> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return json({ error: "payload too large" }, 413);
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "invalid body" }, 400);
  }
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: "payload too large" }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
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
    const denied = await requirePartnerSession(request);
    if (denied) return denied;

    if (request.method === "GET") return await handleGet();
    if (request.method === "PUT") return await handlePut(request);
    return json({ error: "method not allowed" }, 405);
  } catch (error) {
    console.error("[state] error:", error);
    return json({ error: "internal error" }, 500);
  }
}
