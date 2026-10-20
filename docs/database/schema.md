# Craftlane — Database Schema

This document describes the Craftlane database schema, entities, relationships,
constraints, and important design decisions.

## Schema Definition

The canonical schema definition is in [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma).
The initial migration SQL is in [`backend/prisma/migrations/001_init/migration.sql`](../../backend/prisma/migrations/001_init/migration.sql).

## Entities

### User

Authentication identity, account status, and system role.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| email | VARCHAR(255) | No | — | Unique, indexed |
| password_hash | VARCHAR(255) | No | — | Argon2id hash, never plaintext |
| full_name | VARCHAR(255) | No | — | |
| role | VARCHAR(20) | No | `'CLIENT'` | CLIENT, FREELANCER, or ADMIN |
| status | VARCHAR(20) | No | `'PENDING'` | PENDING, ACTIVE, SUSPENDED, DEACTIVATED |
| email_verified | BOOLEAN | No | `FALSE` | |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | Auto-updated |

Indexes: `email` (unique), `status`, `role`

### AuthToken

Password reset and email verification tokens. Single-use, time-limited.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | Primary key |
| user_id | UUID | No | FK → User(id), cascade delete |
| token_hash | VARCHAR(255) | No | Unique, Argon2id hash |
| type | VARCHAR(30) | No | EMAIL_VERIFICATION or PASSWORD_RESET |
| expires_at | TIMESTAMPTZ | No | |
| used_at | TIMESTAMPTZ | Yes | Set when token is consumed |
| created_at | TIMESTAMPTZ | No | `now()` |

Indexes: `user_id`, `token_hash` (unique), `type + expires_at`

### Session

Authenticated user sessions.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | Primary key |
| user_id | UUID | No | FK → User(id), cascade delete |
| token_prefix | VARCHAR(12) | No | First 12 chars of token, for lookup |
| token_hash | VARCHAR(255) | No | Unique, Argon2id hash |
| expires_at | TIMESTAMPTZ | No | |
| created_at | TIMESTAMPTZ | No | `now()` |
| last_used_at | TIMESTAMPTZ | No | `now()` |

Indexes: `user_id`, `token_prefix`, `token_hash` (unique), `expires_at`

### FreelancerProfile

Professional details for freelancer users.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| user_id | UUID | No | — | Unique, FK → User(id), cascade delete |
| headline | VARCHAR(255) | Yes | — | |
| bio | TEXT | Yes | — | |
| location | VARCHAR(255) | Yes | — | |
| hourly_rate_cents | INTEGER | Yes | — | Minor units (cents) |
| currency | VARCHAR(3) | No | `'USD'` | ISO 4217 code |
| availability | VARCHAR(20) | No | `'AVAILABLE'` | AVAILABLE, BUSY, UNAVAILABLE |
| is_public | BOOLEAN | No | `TRUE` | |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `user_id` (unique), `availability`, `is_public`

### ClientProfile

Client or organization details.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| user_id | UUID | No | — | Unique, FK → User(id), cascade delete |
| organization | VARCHAR(255) | Yes | — | |
| bio | TEXT | Yes | — | |
| location | VARCHAR(255) | Yes | — | |
| is_public | BOOLEAN | No | `TRUE` | |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `user_id` (unique), `is_public`

### Skill

Normalized, searchable skill tags.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| name | VARCHAR(100) | No | — | Unique |
| slug | VARCHAR(100) | No | — | Unique, URL-friendly |
| created_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `name` (unique), `slug` (unique)

### ProfileSkill

Junction table: freelancer profile ↔ skills (many-to-many).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | Primary key |
| profile_id | UUID | No | FK → FreelancerProfile(id), cascade delete |
| skill_id | UUID | No | FK → Skill(id), cascade delete |

Constraints: `UNIQUE(profile_id, skill_id)`

### ProjectSkill

Junction table: project ↔ skills (many-to-many).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | Primary key |
| project_id | UUID | No | FK → Project(id), cascade delete |
| skill_id | UUID | No | FK → Skill(id), cascade delete |

Constraints: `UNIQUE(project_id, skill_id)`

### PortfolioItem

Evidence of skills and completed work.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| profile_id | UUID | No | — | FK → FreelancerProfile(id), cascade delete |
| title | VARCHAR(255) | No | — | |
| description | TEXT | Yes | — | |
| url | VARCHAR(500) | Yes | — | |
| thumbnail_url | VARCHAR(500) | Yes | — | |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `profile_id`, `created_at`

### Project

Published job with requirements, budget, and lifecycle.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| client_id | UUID | No | — | FK → ClientProfile(id), cascade delete |
| title | VARCHAR(255) | No | — | |
| description | TEXT | No | — | |
| status | VARCHAR(20) | No | `'DRAFT'` | DRAFT, PUBLISHED, PAUSED, CLOSED, IN_PROGRESS, COMPLETED, CANCELLED |
| project_type | VARCHAR(20) | No | `'FIXED_PRICE'` | FIXED_PRICE or HOURLY |
| budget_min_cents | INTEGER | Yes | — | Minor units (cents) |
| budget_max_cents | INTEGER | Yes | — | Minor units (cents) |
| currency | VARCHAR(3) | No | `'USD'` | ISO 4217 code |
| deadline | TIMESTAMPTZ | Yes | — | |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `client_id`, `status`, `project_type`, `created_at`, `deadline`

Check constraints:
- `budget_min_cents <= budget_max_cents` (when both set)
- `budget_min_cents >= 0` and `budget_max_cents >= 0`

### Proposal

Freelancer's offer to complete a project.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| project_id | UUID | No | — | FK → Project(id), cascade delete |
| freelancer_id | UUID | No | — | FK → User(id), cascade delete |
| cover_message | TEXT | No | — | |
| proposed_price_cents | INTEGER | Yes | — | Minor units (cents) |
| proposed_timeline | VARCHAR(255) | Yes | — | |
| status | VARCHAR(20) | No | `'SUBMITTED'` | SUBMITTED, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN, EXPIRED |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `project_id`, `freelancer_id`, `status`

Constraints: `UNIQUE(project_id, freelancer_id)` — one proposal per freelancer per project

### Contract

Agreed engagement between a client and freelancer.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| project_id | UUID | No | — | FK → Project(id), cascade delete |
| client_id | UUID | No | — | FK → ClientProfile(id), cascade delete |
| freelancer_id | UUID | No | — | FK → User(id), cascade delete |
| agreed_price_cents | INTEGER | No | — | Minor units (cents) |
| currency | VARCHAR(3) | No | `'USD'` | ISO 4217 code |
| status | VARCHAR(20) | No | `'PENDING_ACCEPTANCE'` | PENDING_ACCEPTANCE, ACTIVE, SUBMITTED_FOR_REVIEW, REVISION_REQUESTED, COMPLETED, CANCELLED, DISPUTED |
| terms | TEXT | Yes | — | |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `project_id`, `client_id`, `freelancer_id`, `status`

Check constraints: `agreed_price_cents >= 0`

### Milestone

Contract deliverable, amount, deadline, and state.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| contract_id | UUID | No | — | FK → Contract(id), cascade delete |
| title | VARCHAR(255) | No | — | |
| description | TEXT | Yes | — | |
| amount_cents | INTEGER | Yes | — | Minor units (cents) |
| currency | VARCHAR(3) | No | `'USD'` | ISO 4217 code |
| due_date | TIMESTAMPTZ | Yes | — | |
| status | VARCHAR(20) | No | `'PENDING'` | PENDING, IN_PROGRESS, SUBMITTED, REVISION_REQUESTED, APPROVED, CANCELLED |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `contract_id`, `status`, `due_date`

Check constraints: `amount_cents >= 0`

### Report

User-submitted abuse or safety reports.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID | No | `uuid_generate_v4()` | Primary key |
| reporter_id | UUID | Yes | — | FK → User(id), set null on delete |
| target_type | VARCHAR(50) | No | — | e.g. 'user', 'project', 'profile', 'proposal' |
| target_id | UUID | No | — | |
| reason | TEXT | No | — | |
| status | VARCHAR(20) | No | `'PENDING'` | PENDING, REVIEWED, RESOLVED, DISMISSED |
| created_at | TIMESTAMPTZ | No | `now()` | |
| updated_at | TIMESTAMPTZ | No | `now()` | |

Indexes: `reporter_id`, `target_type + target_id`, `status`

### AuditEvent

Important administrative and business events.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | Primary key |
| actor_id | UUID | Yes | FK → User(id), set null on delete |
| action | VARCHAR(100) | No | |
| entity_type | VARCHAR(50) | No | |
| entity_id | UUID | No | |
| metadata | JSONB | Yes | |
| created_at | TIMESTAMPTZ | No | `now()` |

Indexes: `actor_id`, `action`, `entity_type + entity_id`, `created_at`

## Money Handling

All monetary values are stored as **integer minor units (cents)** in columns
with the `_cents` suffix. Floating-point types are never used for currency.
Application code converts to/from decimal display by dividing/multiplying by 100.

## Lifecycle States

### Project Status
DRAFT → PUBLISHED → (PAUSED \| CLOSED) → (IN_PROGRESS → COMPLETED) → CANCELLED

### Proposal Status
SUBMITTED → (SHORTLISTED \| ACCEPTED \| REJECTED \| WITHDRAWN \| EXPIRED)

### Contract Status
PENDING_ACCEPTANCE → ACTIVE → (SUBMITTED_FOR_REVIEW → REVISION_REQUESTED → ...) → (COMPLETED \| CANCELLED \| DISPUTED)

### Milestone Status
PENDING → IN_PROGRESS → SUBMITTED → (REVISION_REQUESTED → ...) → APPROVED → CANCELLED

## Design Decisions

1. **UUID primary keys** — Opaque identifiers safe to expose in APIs, no sequential ID enumeration.
2. **Integer cents for money** — Avoids floating-point precision errors in financial calculations.
3. **Token hashes with prefix lookup** — Session and auth tokens are stored as Argon2id hashes; a 12-character prefix is kept for efficient lookup.
4. **Cascade delete on ownership** — Deleting a user cascades to their profiles, sessions, auth tokens, and proposals. Projects cascade to proposals, contracts, and project skills.
5. **No default admin** — Admin roles must be explicitly assigned; no hardcoded credentials.
6. **Explicit check constraints** — Budget ranges and positive monetary values are enforced at the database level.
