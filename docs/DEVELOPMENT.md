# Craftlane — Development Guide

## Local Development

### Prerequisites

- Node.js (v20 or later)
- npm

### Installation

```bash
cd frontend
npm install
cp .env.example .env
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier formatter |
| `npm run format:check` | Check Prettier formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run Vitest tests |
| `npm run test:watch` | Run Vitest in watch mode |

### Environment Variables

Create `frontend/.env` from `frontend/.env.example`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

The `VITE_` prefix is required for Vite to expose the variable to client
code. Never put secrets in `VITE_*` variables.

## Troubleshooting

### Port already in use

If port 5173 is occupied, change it in `vite.config.ts` or use:

```bash
npm run dev -- --port 3000
```

### TypeScript errors

Run `npm run typecheck` to see all type errors. Do not suppress errors with
`@ts-ignore` or `any` without a documented reason.

### Test failures

Run `npm test` to see all test failures. Tests use Vitest with jsdom and
React Testing Library. Mock the API service layer when testing components
that call the backend.

### Build failures

The build command runs `tsc --noEmit && vite build`. Fix type errors
first, then build issues.

## Adding a New Page

1. Create the page component in `src/pages/` or `src/features/*/`.
2. Add the route to `src/app/router.tsx` with lazy loading.
3. Add navigation links in `src/components/layout/Header.tsx`.
4. Write tests following existing patterns.
5. Run `npm run typecheck`, `npm run lint`, and `npm test`.

## Backend Integration

The frontend is designed to connect to a separate FastAPI backend. API
endpoints are centralized in `src/services/endpoints.ts`. The API client
in `src/services/api-client.ts` handles fetch, error parsing, and
consistent error propagation.

No authentication token management is implemented in Phase 1. When a
backend auth contract is agreed upon, add token handling to
`src/app/providers.tsx` and the auth service layer.
