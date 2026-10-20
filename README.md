# Craftlane

**Real skills. Clear agreements. Better work.**

Craftlane is a global freelancing marketplace connecting clients with
freelancers through transparent project scopes, evidence-based portfolios,
and structured milestone collaboration.

## Current Status

**Phase 1 & 2: Project Foundation, Frontend, and Database Layer**

The frontend (React + TypeScript + Vite) is complete and runs standalone.
The database layer (PostgreSQL + Prisma ORM) and backend API (Fastify +
TypeScript) have been implemented. The backend requires a PostgreSQL
database to run; see the Database Setup section below.

No fake data is used: no fabricated users, reviews, ratings, projects,
earnings, or activity metrics.

## Core Product Principles

- Trust earned through verifiable information, not invented social proof.
- Simple, intuitive, accessible interfaces.
- Transparent scopes, evidence-based portfolios, milestone collaboration.
- No simulated actions represented as completed real operations.
- No fake data to inflate popularity or activity.

## Technology Stack

### Frontend

- React 19, TypeScript (strict), Vite 6
- React Router 7 (client-side routing)
- CSS Modules + global design tokens
- Lucide React (icons)
- React Hook Form + Zod (form validation)
- Vitest + React Testing Library (testing)
- ESLint 9 + Prettier (linting and formatting)

### Backend

- Fastify (Node.js web framework)
- TypeScript (strict)
- Prisma ORM (database access)
- PostgreSQL (primary relational database)
- Argon2id (password hashing)
- Zod (runtime validation)
- Vitest (testing)

## Prerequisites

- Node.js (v20 or later)
- npm
- PostgreSQL (v15 or later, required for backend)

## Local Setup

### Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the development server
npm run dev
```

The frontend runs at `http://localhost:5173`.

### Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Generate the Prisma client
npm run prisma:generate

# Copy environment template
cp .env.example .env
# Edit backend/.env with your DATABASE_URL and JWT_SECRET

# Create a PostgreSQL database
createdb craftlane_dev

# Apply migrations
npm run prisma:migrate:dev

# Seed development data (optional)
npm run prisma:seed

# Start the backend
npm run dev
```

The backend runs at `http://localhost:8000`.

### Environment Configuration

#### Frontend (`frontend/.env.example`)

```
VITE_API_BASE_URL=http://localhost:8000/api
```

#### Backend (`backend/.env.example`)

```
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://craftlane:craftlane@localhost:5432/craftlane
JWT_SECRET=change-me-in-production
FRONTEND_URL=http://localhost:5173
```

`VITE_*` variables are embedded in the client bundle by Vite. Never put
passwords, API keys, or other secrets in `VITE_*` variables.

Backend secrets (`DATABASE_URL`, `JWT_SECRET`) are server-only and must
never be exposed to the frontend.

## Available Scripts

### Frontend (run from `frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier formatter |
| `npm run format:check` | Check Prettier formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run Vitest tests |
| `npm run test:watch` | Run Vitest in watch mode |

### Backend (run from `backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier formatter |
| `npm run format:check` | Check Prettier formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run Vitest tests |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate:dev` | Apply migrations in development |
| `npm run prisma:migrate:deploy` | Apply migrations in production |
| `npm run prisma:seed` | Seed development data |
| `npm run prisma:studio` | Open Prisma Studio |

## Project Structure

```
craftlane/
├── frontend/              # React + TypeScript + Vite application
├── backend/               # Fastify + Prisma + PostgreSQL API
│   ├── prisma/
│   │   ├── schema.prisma    # Data model definition
│   │   ├── migrations/      # Migration SQL files
│   │   └── seed.ts          # Development seed data
│   ├── src/
│   │   ├── lib/             # Prisma client, auth utilities
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic
│   │   └── middleware/      # Auth and validation middleware
│   └── tests/               # Database integration tests
├── docs/                    # Product and architecture documentation
│   └── database/            # Database documentation
├── README.md                # This file
├── SECURITY.md              # Security reporting guidelines
├── LICENSE                  # License (all rights reserved, pending review)
├── CONTRIBUTING.md          # Contribution guidelines
├── CODE_OF_CONDUCT.md       # Community code of conduct
├── .gitignore               # Git exclusions
├── .editorconfig            # Editor configuration
└── .env.example             # Environment variable template (root reference)
```

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — Product overview and MVP boundaries
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Frontend architecture
- [`docs/FRONTEND_GUIDELINES.md`](docs/FRONTEND_GUIDELINES.md) — Design guidelines
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — Development and troubleshooting
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — Architectural decision records
- [`docs/database/README.md`](docs/database/README.md) — Database overview
- [`docs/database/schema.md`](docs/database/schema.md) — Database schema reference
- [`docs/database/migrations.md`](docs/database/migrations.md) — Migration workflow
- [`docs/database/seeding.md`](docs/database/seeding.md) — Development seed data
- [`docs/database/testing.md`](docs/database/testing.md) — Test setup and commands
- [`docs/database/security.md`](docs/database/security.md) — Database security
- [`docs/database/backup-and-recovery.md`](docs/database/backup-and-recovery.md) — Backups

## Current Limitations

- The backend requires PostgreSQL; it cannot run without a database.
- PostgreSQL is not installed in the current environment (see setup
  instructions above).
- Backend integration tests require a test database (`TEST_DATABASE_URL`).
- Payments, escrow, messaging, notifications, and reviews are not implemented
  in this phase.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Security

See [`SECURITY.md`](SECURITY.md).

## License

See [`LICENSE`](LICENSE). All rights reserved pending license review.

## Not Production Ready

Craftlane is in early development. Do not use in production. Real
authentication, authorization, data validation, and business-rule enforcement
are implemented by the backend, but the system has not undergone security
review or production hardening.