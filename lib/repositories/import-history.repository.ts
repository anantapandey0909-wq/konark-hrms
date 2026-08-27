/**
 * Import / export / bulk history repository — read-only AuditLog access.
 * companyId is always trusted (from getTenantPrisma), never from the client.
 */

import { prisma } from "@/lib/prisma";

/**
 * Action strings discovered from writeAuditLog() call sites in this repo.
 * Do not invent names — keep in sync with import/export/bulk services.
 */
export const HISTORY_AUDIT_ACTIONS = [
  // Batch imports (one audit row per successful commit)
  "EMPLOYEES_IMPORTED",
  "LEAVE_IMPORT_COMPLETED",
  "ATTENDANCE_IMPORTED",
  // Per-record creates from CSV import (group by actor + time window)
  "DEPARTMENT_CREATED",
  "PAYROLL_CREATED",
  // Export Center
  "DATA_EXPORTED",
  // Bulk employee operations (one audit row per affected employee)
  "BULK_EMPLOYEE_ACTIVATED",
  "BULK_EMPLOYEE_DEACTIVATED",
  "BULK_EMPLOYEE_DEPARTMENT_TRANSFERRED",
  "BULK_EMPLOYEE_MANAGER_ASSIGNED",
] as const;

export type HistoryAuditAction = (typeof HISTORY_AUDIT_ACTIONS)[number];

export async function findHistoryAuditLogs(
  companyId: string,
  options?: { limit?: number }
) {
  const limit = Math.min(Math.max(options?.limit ?? 150, 1), 300);

  return prisma.auditLog.findMany({
    where: {
      companyId,
      action: { in: [...HISTORY_AUDIT_ACTIONS] },
    },
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
