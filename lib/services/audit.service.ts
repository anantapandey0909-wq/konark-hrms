import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function writeAuditLog(input: {
  companyId: string;
  actorId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  /** Nested JSON allowed — Prisma.InputJsonValue (not Record of unknown). */
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        companyId: input.companyId,
        actorId: input.actorId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: input.metadata ?? undefined,
      },
    });
  } catch (error) {
    // Audit must not break primary mutation
    console.error("[audit]", error);
  }
}
