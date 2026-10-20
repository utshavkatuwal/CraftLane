# Craftlane — Database Migrations

This document describes the migration workflow for the Craftlane database.

## Migration System

Craftlane uses **Prisma Migrate** to manage schema changes. The canonical
schema definition is in [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma),
and migration SQL files live in [`backend/prisma/migrations/`](../../backend/prisma/migrations/).

## Creating a Migration

1. Edit `backend/prisma/schema.prisma` to reflect the desired schema changes.
2. Generate a migration:

   ```bash
   cd backend
   npm run prisma:migrate:dev -- --name <migration_name>
   ```

   This creates a new directory under `prisma/migrations/` containing the
   generated SQL and a `migration.lock` file.

3. Review the generated SQL in the migration directory before applying it.

4. Apply the migration to your development database:

   ```bash
   npm run prisma:migrate:dev
   ```

## Applying Migrations

### Development

```bash
cd backend
npm run prisma:migrate:dev
```

This applies pending migrations and attempts to reset the database if schema
drift is detected (only safe in development).

### Production

```bash
cd backend
npm run prisma:migrate:deploy
```

This applies pending migrations without any safety resets. **Always back up
the database before running production migrations** (see
[backup-and-recovery.md](backup-and-recovery.md)).

## Migration Files

Each migration directory contains:

- `migration.sql` — The SQL to apply the migration.
- `migration.lock` — A lock file recording the migration's hash and applied
  schema state.

### Initial Migration (`001_init`)

The initial migration creates all tables for the MVP marketplace:

- `User` — authentication identity
- `AuthToken` — password reset / email verification tokens
- `Session` — authenticated user sessions
- `FreelancerProfile` / `ClientProfile` — user profiles
- `Skill` — normalized skill tags
- `ProfileSkill` / `ProjectSkill` — skill junction tables
- `PortfolioItem` — work evidence
- `Project` — published jobs
- `Proposal` — freelancer offers
- `Contract` — hiring agreements
- `Milestone` — contract deliverables
- `Report` — abuse/safety reports
- `AuditEvent` — administrative events

## Rollback and Recovery

Prisma Migrate does not support automatic down-migrations. To reverse a
migration:

1. Manually write SQL to reverse the changes.
2. Apply it to the database.
3. Update `schema.prisma` to reflect the reversed state.
4. Create a new migration that captures the reversed schema.

If a migration fails partway through, inspect the database state and
manually complete or reverse the remaining changes before re-running.

## Clean Database Initialization

To initialize a clean database from scratch:

```bash
cd backend
createdb craftlane_dev
npm run prisma:migrate:dev
npm run prisma:seed   # optional: load development data
```

Never use `prisma migrate reset` against a database containing user data —
it will delete all data.
