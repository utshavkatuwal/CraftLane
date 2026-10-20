# Craftlane — Frontend Architecture

## Stack

- React 19 with TypeScript (strict mode)
- Vite 6 (dev server and build tool)
- React Router 7 (client-side routing)
- CSS Modules + global CSS design tokens
- Lucide React (icons)
- React Hook Form + Zod (form validation)
- Vitest + React Testing Library (testing)
- ESLint 9 + Prettier (linting and formatting)

## Directory Structure

```
frontend/
├── src/
│   ├── app/           # Router, providers, root App
│   ├── assets/        # Static assets
│   ├── components/    # Reusable UI components
│   │   ├── ui/        # Primitive UI components (Button, Input, etc.)
│   │   └── layout/    # Layout components (Header, Footer, Page)
│   ├── features/      # Feature-based code (auth, marketplace, etc.)
│   ├── layouts/       # (unused, kept for future)
│   ├── pages/         # Route-level page components
│   ├── services/      # API client and endpoint definitions
│   ├── hooks/         # Custom React hooks (unused, kept for future)
│   ├── types/         # Shared TypeScript domain types
│   ├── utils/         # Pure utility functions
│   ├── styles/        # Design tokens, global styles, utilities
│   └── test/          # Test setup and utilities
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
└── .env.example
```

## Routing

Routes are defined in `src/app/router.tsx` using `createBrowserRouter`.
Routes are lazy-loaded for code splitting. The route table includes:

- `/` — Landing page
- `/sign-up` — Registration
- `/sign-in` — Sign in
- `/work` — Marketplace browsing
- `/work/:projectId` — Project detail
- `/freelancers/:id` — Freelancer profile
- `/dashboard/client` — Client dashboard shell
- `/dashboard/freelancer` — Freelancer dashboard shell
- `*` — Not found (404)

## API Integration

The API service layer (`src/services/api-client.ts`) provides a typed fetch
wrapper. Endpoints are centralized in `src/services/endpoints.ts`. The base
URL is configured via `VITE_API_BASE_URL` in `.env`.

No authentication tokens or sessions are managed by the frontend in Phase 1.
All API calls fail honestly when no backend is available.

## Component Architecture

UI primitives (Button, Input, Label, FormField, etc.) are in
`src/components/ui/` with CSS Modules. Feature-specific components are in
their respective `src/features/*` directories. Page components are in
`src/pages/` and `src/features/*/`.

## Design System

Design tokens (colors, spacing, typography, borders, radii, transitions) are
defined in `src/styles/tokens.css`. The visual identity uses restrained
neutral colors with a single brand accent (#1d4ed8), subtle glassmorphism,
and fine borders.

## Accessibility

The frontend targets WCAG 2.2 AA: semantic HTML, proper form labels,
keyboard-accessible controls, visible focus indicators, sufficient contrast,
correct heading hierarchy, and reduced-motion support.

## Backend Integration Assumptions

A FastAPI backend (separate phase) will provide:
- Authentication (signup, signin, signout, me)
- Project CRUD and listing
- Proposal submission and management
- Profile management
- Skill listings

The frontend does not assume a specific authentication token format and does
not implement token storage.
