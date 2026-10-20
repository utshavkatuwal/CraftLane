# Craftlane — Frontend Guidelines

## Design Principles

- **Trust through evidence:** Interfaces show verifiable information, not
  invented social proof. No fake testimonials, user counts, or ratings.
- **Simple and intuitive:** Prefer a small number of well-designed components
  over a large collection of visually repetitive cards.
- **Premium and calm:** Subtle glassmorphism, restrained translucency,
  controlled blur, sophisticated neutral colors, one brand accent.
- **Accessible:** WCAG 2.2 AA, keyboard navigation, visible focus indicators,
  sufficient contrast, reduced-motion support.

## Visual Identity

### Colors

- **Brand accent:** `#1d4ed8` (blue) — used sparingly for primary actions
  and active states.
- **Neutral surfaces:** White, `#f8fafc`, `#ffffff` with subtle borders.
- **Text:** `#0f172a` (primary), `#334155` (secondary), `#64748b` (muted).
- **Semantic:** `#dc2626` (danger), `#059669` (success), `#d97706` (warning).

### Typography

- Font stack: `Inter`, system-ui, sans-serif.
- Clear heading hierarchy (h1–h6) with `letter-spacing: -0.01em`.
- Body text at `1rem` with `1.5` line height.

### Spacing

- Based on a 4px grid: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px,
  64px, 80px.

### Borders & Radii

- `1px` borders in `#e2e8f0`.
- Radii: 6px (sm), 8px (base), 12px (md), 16px (lg), 9999px (full).

### Glassmorphism

Used sparingly for elevated surfaces. Never for content that needs high
readability. Opaque surfaces preferred for form content.

## Components

Build reusable primitives where reuse genuinely helps:
- Button, Input, Label, FormField, Card, Badge, Avatar, Link, Dialog,
  Loader, EmptyState, ErrorMessage.

Avoid premature abstraction. Do not build a complex design system for a few
pages.

## Responsive Behavior

Mobile-first breakpoints:
- `640px` (sm)
- `1024px` (lg)

Test at narrow mobile, tablet, laptop, and wide desktop sizes. Avoid
horizontal overflow, clipped dialogs, and tiny touch targets.

## Accessibility Rules

- Semantic HTML elements (header, nav, main, section, article, footer).
- Proper `<label>` elements with `htmlFor` / `id` associations.
- Visible focus indicators (`:focus-visible`).
- ARIA attributes where native HTML is insufficient.
- Sufficient color contrast (4.5:1 for normal text).
- Correct heading hierarchy (h1 → h2 → h3).
- No color-only communication.
- Reduced-motion support via `prefers-reduced-motion`.

## What to Avoid

- Generic AI-generated SaaS aesthetics.
- Excessive gradients, rainbow/neon colors, pastel-heavy styling.
- Large glowing elements, heavy drop shadows, bento grids.
- Excessive pill-shaped containers, floating cards, decorative charts.
- Fake testimonials, user counts, earnings, or activity metrics.
- `lorem ipsum` in the finished interface.
- `dangerouslySetInnerHTML` unless sanitized and justified.
- Storing passwords or tokens in browser-persistent state.
