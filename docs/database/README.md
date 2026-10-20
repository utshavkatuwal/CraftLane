# Craftlane — Database Documentation

This directory contains documentation for the Craftlane database layer.

## Documents

- [schema.md](schema.md) — Entities, relationships, constraints, and design decisions
- [migrations.md](migrations.md) — Migration creation, application, and recovery workflow
- [seeding.md](seeding.md) — Development seed data and fixture usage
- [testing.md](testing.md) — Test database setup and test commands
- [security.md](security.md) — Database security and operational safeguards
- [backup-and-recovery.md](backup-and-recovery.md) — Backup, restoration, and disaster recovery

## Architecture

Craftlane uses **PostgreSQL** as its primary relational database, accessed through
**Prisma ORM** with TypeScript. Database schema changes are managed through
**Prisma Migrate**.

## Repository Layout

```
backend/
├── prisma/
│   ├── schema.prisma          # Prisma data model definition
│   ├── migrations/            # Migration SQL files
│   │   └── 001_init/
│   │       └── migration.sql
│   └── seed.ts                # Development seed data
├── src/
│   ├── lib/prisma.ts          # Prisma client singleton
│   ├── lib/auth.ts            # Authentication utilities (argon2, token hashing)
│   ├── routes/                # API route handlers
│   ├── services/              # Business logic
│   └── middleware/            # Auth and validation middleware
├── tests/                     # Database integration tests
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.js
├── .prettierrc
└── .env.example
```

## Prerequisites

- Node.js (v20 or later)
- npm
- PostgreSQL (v15 or later)

## Local Development Setup

1. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   ```

4. Start PostgreSQL and create a database:

   ```bash
   createdb craftlane_dev
   ```

5. Apply migrations:

   ```bash
   npm run prisma:migrate:dev
   ```

6. Seed development data (optional):

   ```bash
   npm run prisma:seed
   ```

7. Start the backend:

   ```bash
   npm run dev
   ```

## Environment Variables

See [`backend/.env.example`](backend/.env.example) for required variables.

## Testing

See [testing.md](testing.md) for test setup and commands.

## Security

See [security.md](security.md) for database security practices.

## Backups

See [backup-and-recovery.md](backup-and-recovery.md) for backup and recovery procedures.
