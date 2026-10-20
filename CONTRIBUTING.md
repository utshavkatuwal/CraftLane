# Craftlane — Contributing Guide

Thank you for considering contributing to Craftlane! Craftlane is a global
freelancing marketplace built on transparency, evidence, and clear agreements.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm (comes with Node.js)

### Setup

1. Clone the repository.
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Copy the environment template:
   ```
   cp .env.example .env
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## How to Contribute

1. **Create a branch** from the main branch with a descriptive name
   (e.g., `feature/marketplace-filters` or `fix/auth-validation`).
2. **Make your changes** following the coding standards below.
3. **Run validation checks**:
   - `npm run typecheck` — TypeScript type checking
   - `npm run lint` — ESLint
   - `npm run format:check` — Prettier formatting
   - `npm test` — Vitest tests
   - `npm run build` — Production build
4. **Commit your changes** with a clear, conventional commit message.
5. **Open a pull request** describing what you changed and why.

## Coding Standards

- TypeScript with strict mode enabled. Avoid `any` unless justified.
- React functional components with hooks.
- CSS Modules for component styling; global design tokens in `src/styles/`.
- Form validation with React Hook Form and Zod.
- Accessible components: semantic HTML, proper labels, visible focus
  indicators, ARIA attributes where needed.
- No fake data: never fabricate users, reviews, projects, or metrics.
- Honest state handling: loading, empty, and error states must be truthful.
- No console.log or debugger statements in committed code.

## Pull Request Expectations

- All validation checks must pass.
- Tests should cover new components and behaviors.
- Documentation should be updated if user-facing behavior changes.
- No fabricated data, testimonials, or metrics.
- Clearly mark incomplete functionality.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidelines.
