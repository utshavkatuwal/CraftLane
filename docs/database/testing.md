# Craftlane — Database Testing

This document describes the test database setup and test commands for Craftlane.

## Test Infrastructure

Craftlane uses **Vitest** with Node.js environment for backend tests. Tests
are located in [`backend/tests/`](../../backend/tests/).

## Test Database

Tests require a PostgreSQL test database. Set up as follows:

1. Create a test database:

   ```bash
   createdb craftlane_test
   ```

2. Configure the test database URL:

   ```bash
   export TEST_DATABASE_URL="postgresql://user:password@localhost:5432/craftlane_test"
   ```

   Or add it to `backend/.env` (gitignored).

3. Apply migrations to the test database:

   ```bash
   cd backend
   DATABASE_URL="$TEST_DATABASE_URL" npm run prisma:migrate:dev
   ```

4. Run tests:

   ```bash
   npm test
   ```

## Running Tests Without a Database

If PostgreSQL is not available, schema validation tests (Zod schemas) still
run. Database-dependent tests are skipped with a clear warning message when
no `DATABASE_URL` or `TEST_DATABASE_URL` is configured.

## Test Files

| File | Description |
|------|-------------|
| `tests/setup.ts` | Database connection setup and teardown |
| `tests/auth.test.ts` | Auth service validation and service logic |
| `tests/projects.test.ts` | Project route validation schemas |

## Writing Tests

- Use `vitest` with `describe`/`it`/`expect`.
- For database tests, import `prisma` from `tests/setup.ts`.
- Use `vi.mock` for Prisma client when testing without a live database.
- Never run destructive tests against production or unverified database targets.

## Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |

## CI

In CI, ensure PostgreSQL is available as a service container before running
tests. See the project's CI configuration (to be added) for details.
