import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton for Next.js.
 * Prevents multiple instances in development (hot reload).
 *
 * Phase 0 foundation — not yet used by frontend modules.
 * Frontend continues to rely on mock data until later phases.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
