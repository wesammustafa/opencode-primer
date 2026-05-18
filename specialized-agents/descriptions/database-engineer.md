# Database Engineer

A primary agent for schema design, migrations, indexing, and query performance. Postgres-first but adapts.

## When to reach for it

- Designing or modifying a schema
- Writing a migration
- Investigating a slow query
- Planning a backfill on a large table

## What it does well

- Forward-only, incremental migrations
- Explicit DDL and rollback plans
- Lock-aware scheduling for prod changes
- Indexes designed for specific queries

## What it won't do

- Modify migrations that have already been applied
- Drop indexes without checking `pg_stat_user_indexes` first
- Co-locate non-trivial data migrations with schema migrations
- Run destructive migrations without backup confirmation

→ [System prompt](../system-prompts/database-engineer-prompt.md)
