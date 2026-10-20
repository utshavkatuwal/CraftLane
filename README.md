# Craftlane

**Real skills. Clear agreements. Better work.**

Craftlane is a global freelancing marketplace connecting clients with
freelancers through transparent project scopes, evidence-based portfolios,
and structured milestone collaboration.

## Current Status

**Phase 1: Project Foundation & Frontend** — In development.

This is a frontend-only prototype. No backend is connected. Account actions
and project interactions do not perform real operations. No fake data is
used: no fabricated users, reviews, ratings, projects, earnings, or activity
metrics.

## Core Product Principles

- Trust earned through verifiable information, not invented social proof.
- Simple, intuitive, accessible interfaces.
- Transparent scopes, evidence-based portfolios, milestone collaboration.
- No simulated actions represented as completed real operations.
- No fake data to inflate popularity or activity.

## Technology Stack

- React 19, TypeScript (strict), Vite 6
- React Router 7 (client-side routing)
- CSS Modules + global design tokens
- Lucide React (icons)
- React Hook Form + Zod (form validation)
- Vitest + React Testing Library (testing)
- ESLint 9 + Prettier (linting and formatting)

## Prerequisites

- Node.js (v20 or later)
- npm

## Local Setup

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

The app runs at `http://localhost:5173`.

## Available Scripts (run from `frontend/`)

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

## Environment Configuration

Copy `frontend/.env.example` to `frontend/.env` and adjust:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

`VITE_*` variables are embedded in the client bundle by Vite. Never put
passwords, API keys, or other secrets in `VITE_*` variables.

## Project Structure

```
craftlane/
├── frontend/              # React + TypeScript + Vite application
├── docs/                  # Product and architecture documentation
├── README.md              # This file
├── SECURITY.md            # Security reporting guidelines
├── LICENSE                # License (all rights reserved, pending review)
├── CONTRIBUTING.md        # Contribution guidelines
├── CODE_OF_CONDUCT.md     # Community code of conduct
├── .gitignore             # Git exclusions
├── .editorconfig          # Editor configuration
└── .env.example           # Environment variable template (root reference)
```

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — Product overview and MVP boundaries
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Frontend architecture
- [`docs/FRONTEND_GUIDELINES.md`](docs/FRONTEND_GUIDELINES.md) — Design guidelines
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — Development and troubleshooting
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — Architectural decision records

## Current Limitations

- No backend is connected. All account and project actions are frontend-only.
- No authentication tokens or session management.
- No real project data is displayed (empty states are shown honestly).
- Payments, escrow, messaging, notifications, and reviews are not implemented.
- These require separate backend and product work in later phases.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Security

See [`SECURITY.md`](SECURITY.md).

## License

See [`LICENSE`](LICENSE). All rights reserved pending license review.

## Not Production Ready

Craftlane is in early development. Do not use in production. The frontend
is a prototype that does not connect to a backend. Real authentication,
authorization, data validation, and business-rule enforcement must be
implemented by the backend.
