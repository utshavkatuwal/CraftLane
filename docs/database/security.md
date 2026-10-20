# Craftlane — Database Security

This document describes database security practices and operational safeguards
for Craftlane.

## Access Control

### Least-Privilege Database Access

The application database user (`craftlane` or similar) should have only the
permissions needed:

- `CONNECT` on the database
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` on application tables
- `USAGE` on schemas and sequences

The application user should **not** have:
- `SUPERUSER`
- `CREATEDB` / `CREATEROLE`
- Access to `pg_catalog` or `information_schema` beyond what's needed
- Permission to drop or alter tables

### Separate Credentials

- **Application credentials**: Used by the backend service at runtime.
- **Administrative credentials**: Used only by operators for maintenance,
  backups, and migrations. Never used by the application.
- **Migration credentials**: May be the same as administrative credentials.

All credentials are stored in environment variables (`DATABASE_URL`) and never
in source code.

## Secret Management

- `DATABASE_URL` and `JWT_SECRET` are configured via `.env` (gitignored).
- `.env.example` contains only safe placeholder values.
- Never commit `.env` files containing real secrets.
- Rotate `JWT_SECRET` and database passwords periodically.

## SQL Injection Protection

All database access goes through **Prisma ORM**, which uses parameterized
queries under the hood. Raw SQL is avoided; when used (e.g. `$queryRaw`),
values are passed as parameters, never interpolated.

## Authentication and Sessions

- Passwords are hashed with **Argon2id** via the `argon2` package.
- Password hashes are never stored in plaintext.
- Session tokens are stored as Argon2id hashes (`token_hash`) with a
  plaintext prefix (`token_prefix`) for lookup.
- Auth tokens (password reset, email verification) are stored as hashes and
  are single-use with expiration.
- Raw tokens are emitted to clients only once (at creation time) via email.

## Row-Level Security (RQL)

PostgreSQL Row-Level Security is **not currently enabled**. Application-layer
authorization enforces ownership and role boundaries:

- Users can only read/update their own profiles.
- Clients can only modify their own projects.
- Freelancers can only submit proposals to published projects.
- Admin role is required for cross-user operations.

If RQL is enabled in the future, it must be tested to confirm policies are
correctly enforced and do not conflict with application-layer authorization.

## Error Handling

- Database errors are caught and logged without exposing connection details,
  SQL parameters, or credential information.
- Client-facing error messages are generic (e.g. "Internal server error")
  with detailed errors logged server-side only.

## PII Handling

- Only necessary personal information is collected (name, email, location,
  bio).
- Email addresses are unique and indexed.
- Users can control profile visibility via `is_public` fields.
- Data retention and deletion policies are to be defined before commercial
  launch (see [PRD §8.3](../../prd.md#83-privacy)).

## Credential Rotation

1. Generate new database password.
2. Update `DATABASE_URL` in the application environment.
3. Restart the application.
4. Rotate the old password after confirming the application works.

## Audit Logging

`AuditEvent` records important administrative and business events including
actor, action, entity type, entity ID, and optional metadata. This provides
an audit trail for security-relevant operations.
