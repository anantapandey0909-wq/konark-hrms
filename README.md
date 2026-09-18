This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Architecture & Setup

Konark HRMS is a multi-tenant Human Resource Management System.

### Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Data:** Prisma + PostgreSQL (feature-flagged; mock data still available in development)
- **Auth:** Mock localStorage session in development, or real HTTP-only cookie sessions when real auth is enabled

### Environment

1. Copy `.env.example` to `.env` / `.env.local`.
2. Set values for your environment (see production checklist below).

```bash
cp .env.example .env
```

### Prisma scripts

```bash
npm run db:generate        # Generate Prisma Client
npm run db:push            # Push schema (dev)
npm run db:migrate         # Create/apply migrations (dev)
npm run db:migrate:deploy  # Apply migrations (production)
npm run db:seed            # Seed database (development only — review before any prod use)
npm run db:studio          # Open Prisma Studio
```

Prisma Client is available via `lib/prisma.ts` (singleton).

### Important

- Do not commit real secrets. `.env` / `.env.local` are gitignored; `.env.example` is safe to commit.
- Backend work is introduced in controlled phases.

## Production configuration checklist

Production is **fail-closed**: mock data and mock authentication must not be used when `NODE_ENV=production`.

### Required environment variables

```bash
NODE_ENV=production

# Real authentication (cookie session) — required in production
NEXT_PUBLIC_USE_REAL_AUTH=true
USE_REAL_AUTH=true

# Real PostgreSQL-backed domain data — required in production
NEXT_PUBLIC_USE_REAL_DATA=true
# Optional server alias:
# USE_REAL_DATA=true

# Session signing secret (server-only, min 32 characters)
# Generate: openssl rand -base64 48
AUTH_SECRET=<strong-random-secret-at-least-32-chars>

# Production database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public

# Public origin (use https in production)
APP_URL=https://your-production-domain
# NEXT_PUBLIC_APP_URL=https://your-production-domain
```

### Production rules

| Config | Production requirement |
|--------|------------------------|
| Real auth flags | Must be `true` (`assertProductionRealAuth`) |
| Real data flags | Must be `true` (`assertProductionRealData`) |
| Valid matrix | Real auth ON + real data ON |
| HTTPS | Required for production traffic |
| Session cookies | `Secure` resolves from `APP_URL` / `COOKIE_SECURE` — use HTTPS so cookies are Secure |
| Secrets | Never commit `.env.local` or production secrets |
| Migrations | Apply with `npm run db:migrate:deploy` (or `npx prisma migrate deploy`) |
| Seed | Do **not** treat development seed data as a production user source without review |

### Development matrix (for comparison)

| Real auth | Real data | Behavior |
|-----------|-----------|----------|
| OFF | OFF | Mock auth + mock data (default local) |
| ON | OFF | Real cookie auth; domain modules may still mock until real data is on |
| OFF | ON | Client may use mock login; server actions lack cookies and fail |
| ON | ON | Full real stack |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
