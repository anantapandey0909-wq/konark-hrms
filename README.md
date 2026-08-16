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

## Architecture & Setup (Phase 0)

Konark HRMS is a multi-tenant Human Resource Management System. The frontend is currently driven by **mock data** and remains fully functional without a database.

### Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Data (planned):** Prisma + PostgreSQL
- **Auth (current):** Mock credentials + localStorage session (real auth in later phases)

### Environment

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` when you are ready to use Prisma (not required for mock-driven UI).

```bash
cp .env.example .env
```

### Prisma scripts

```bash
npm run db:generate   # Generate Prisma Client
npm run db:push       # Push schema (dev)
npm run db:migrate    # Create/apply migrations (dev)
npm run db:studio     # Open Prisma Studio
```

Prisma Client is available via `lib/prisma.ts` (singleton). No frontend module depends on it yet; all UI continues to use mocks.

### Important

- Do not commit real secrets. `.env` is gitignored; `.env.example` is safe to commit.
- Backend work is introduced in controlled phases. Phase 0 only establishes the foundation.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
