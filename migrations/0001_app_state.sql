-- Single-row shared state for the couple's app data (tasks, wishes, events,
-- plans, docs, capsules, votes, partners, startedAt). Whole-document reads
-- and writes — two people, infrequent changes, not worth a table per entity
-- when the client already treats this as one slice (see src/lib/store.ts).
-- id is always 1: this app is a single deployment for one couple, not a
-- multi-tenant service, so there is nothing to key rows by.
CREATE TABLE IF NOT EXISTS app_state (
  id INTEGER PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at BIGINT NOT NULL
);
