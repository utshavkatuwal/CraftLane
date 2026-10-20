# Craftlane — Architectural Decisions

## Decision: Frontend Technology Stack

**Decision:** React 19 + TypeScript + Vite 6 + React Router 7

**Rationale:** The PRD specifies React, TypeScript, Vite, and React Router.
These are current, mutually compatible stable releases. React 19 is the
current stable release with the new JSX transform. Vite 6 provides fast
dev server and build performance. React Router 7 is the current stable
router for React.

**Status:** Implemented

## Decision: CSS Modules + Global Design Tokens

**Decision:** Use CSS Modules for component-scoped styles with global CSS
design tokens in `src/styles/tokens.css`.

**Rationale:** CSS Modules provide component-scoped styling without the
complexity of a full design system or CSS-in-JS runtime. Global tokens
ensure consistency across components. This is simpler than Tailwind or a
custom design system for a handful of pages.

**Alternatives considered:** Tailwind CSS (rejected: adds build complexity
and utility-class verbosity), styled-components (rejected: runtime overhead),
CSS-in-JS (rejected: unnecessary complexity).

**Status:** Implemented

## Decision: No Global State Management

**Decision:** Do not add Redux, Zustand, Zustand, or Context-based global
state management.

**Rationale:** Phase 1 has no backend integration, so there is no auth state
or data to manage globally. Component-level state (useState, useForm) is
sufficient. Adding global state prematurely would add complexity without
benefit.

**Status:** Implemented (revisit when backend auth is implemented)

## Decision: No Fake Data

**Decision:** Never fabricate users, reviews, ratings, testimonials,
transactions, earnings, projects, or activity.

**Rationale:** Craftlane's core product principle is "Trust should be earned
through verifiable information, not invented social proof." Fake data would
undermine this principle. Empty and error states are honest about what data
is and isn't available.

**Status:** Implemented

## Decision: Frontend Package Manager

**Decision:** Use npm.

**Rationale:** Node.js installation includes npm. npm is the most universal
package manager and works well with the project's dependency set. No
existing lockfile was present to preserve.

**Status:** Implemented (package-lock.json committed)

## Decision: ESLint 9 Flat Config

**Decision:** Use ESLint 9 with flat config (`eslint.config.js`).

**Rationale:** ESLint 9 is the current stable release. Flat config is the
modern configuration format. TypeScript rules come from `typescript-eslint`.

**Status:** Implemented

## Decision: No .env file committed

**Decision:** Only `.env.example` is committed. Local `.env` is gitignored.

**Rationale:** Environment files may contain local configuration that
should not be shared. The `.env.example` provides a safe template with
non-sensitive placeholder values.

**Status:** Implemented
