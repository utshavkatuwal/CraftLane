# Craftlane — Database Seeding

This document describes development seed data and fixture usage for Craftlane.

## Seed File

The seed file is located at [`backend/prisma/seed.ts`](../../backend/prisma/seed.ts).

## Usage

```bash
cd backend
npm run prisma:seed
```

## Seed Data

The seed creates only fictional development data:

- 6 skills (Web Design, React Development, Copywriting, Digital Marketing, UI/UX Design, Python Development)
- 1 freelancer user (`freelancer@example.com`, password `dev-freelancer-password`)
- 1 client user (`client@example.com`, password `dev-client-password`)
- Freelancer profile with bio, location, hourly rate, and skills
- Client profile with organization and bio
- 1 portfolio item
- 1 published project with budget and skills

## Principles

- **No real personal information** — All names, emails, and addresses are fictional.
- **No real credentials** — Passwords are development-only and clearly labeled.
- **No fake production metrics** — No fabricated reviews, ratings, testimonials, or user counts.
- **No default production administrator** — Admin roles are never seeded.
- **Idempotent where practical** — Uses `upsert` for users and profiles to avoid duplicates on repeated runs.
- **Development only** — Never run the seed against a production database.

## Extending Seed Data

To add more seed entities, edit `backend/prisma/seed.ts` and follow the same
patterns: use `upsert` for idempotency, hash passwords with `argon2`, and
reference created records by their returned IDs.
