import { prisma } from "@/lib/prisma";

export async function writeAuditLog(input: {
  companyId: string;
  actorId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
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
