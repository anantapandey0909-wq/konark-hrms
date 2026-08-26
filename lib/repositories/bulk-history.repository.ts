/**
 * Bulk job history repository — read-only AuditLog access.
 * companyId is always trusted (from getTenantPrisma), never from the client.
 */

import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

/** Action strings written by executeBulkEmployeeOperation. */
export const BULK_AUDIT_ACTIONS = [
  "BULK_EMPLOYEE_ACTIVATED",
  "BULK_EMPLOYEE_DEACTIVATED",
  "BULK_EMPLOYEE_DEPARTMENT_TRANSFERRED",
  "BULK_EMPLOYEE_MANAGER_ASSIGNED",
] as const;

export type BulkAuditAction = (typeof BULK_AUDIT_ACTIONS)[number];

export async function findBulkAuditLogs(
  companyId: string,
  options?: { limit?: number }
) {
  const limit = Math.min(Math.max(options?.limit ?? 200, 1), 500);

  return prisma.auditLog.findMany({
    where: tenantScope(companyId, {
      action: { in: [...BULK_AUDIT_ACTIONS] },
      entity: "Employee",
    }),
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      entity: true,
      entityId: true,
      metadata: true,
      createdAt: true,
      actorId: true,
      actor: {
        select: {
          id: true,
          email: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeCode: true,
            },
          },
        },
      },
    },
  });
}
