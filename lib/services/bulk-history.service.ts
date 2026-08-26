/**
 * Bulk job history service — maps AuditLog rows into UI-friendly history entries.
 *
 * Limitations (no schema change):
 * - AuditLog stores one row per affected employee, not a parent "job" entity.
 * - Rows from the same commit are grouped by actor + action within a short time window.
 * - Duration is not stored; UI shows "—".
 * - Only successful commits write audit logs, so status is always Completed.
 * - Job ID is derived from the earliest audit log id in the group (stable, not sequential BCH-YYYY-NNN).
 */

import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import {
  findBulkAuditLogs,
  type BulkAuditAction,
} from "@/lib/repositories/bulk-history.repository";
import type { BulkJobHistoryRow } from "@/types/bulk-operation";

/** Max gap between consecutive per-employee audit writes to treat as one batch. */
const GROUP_WINDOW_MS = 5_000;

const OPERATION_LABELS: Record<BulkAuditAction, string> = {
  BULK_EMPLOYEE_ACTIVATED: "Activate Employees",
  BULK_EMPLOYEE_DEACTIVATED: "Deactivate Employees",
  BULK_EMPLOYEE_DEPARTMENT_TRANSFERRED: "Transfer Department",
  BULK_EMPLOYEE_MANAGER_ASSIGNED: "Assign Manager",
};

function formatRequestedOn(date: Date): string {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actorDisplayName(actor: {
  email: string;
  employee: { firstName: string; lastName: string } | null;
} | null): string {
  if (!actor) return "System";
  if (actor.employee) {
    return `${actor.employee.firstName} ${actor.employee.lastName}`;
  }
  return actor.email;
}

function deriveJobId(primaryLogId: string): string {
  // Prefer a short stable token from the audit UUID (no sequential job counter).
  const compact = primaryLogId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `BCH-${compact}`;
}

export async function listBulkJobHistory(options?: {
  limit?: number;
}): Promise<BulkJobHistoryRow[]> {
  const { companyId } = await getTenantPrisma();
  const logs = await findBulkAuditLogs(companyId, {
    limit: options?.limit ?? 200,
  });

  if (logs.length === 0) return [];

  // Logs are newest-first. Group into batches walking newest → oldest.
  type Group = {
    action: BulkAuditAction;
    actorId: string | null;
    actorName: string;
    logs: typeof logs;
    newestAt: Date;
    oldestAt: Date;
  };

  const groups: Group[] = [];

  for (const log of logs) {
    const action = log.action as BulkAuditAction;
    const last = groups[groups.length - 1];
    const canMerge =
      last &&
      last.action === action &&
      last.actorId === log.actorId &&
      Math.abs(last.oldestAt.getTime() - log.createdAt.getTime()) <=
        GROUP_WINDOW_MS;

    if (canMerge) {
      last.logs.push(log);
      if (log.createdAt < last.oldestAt) last.oldestAt = log.createdAt;
      if (log.createdAt > last.newestAt) last.newestAt = log.createdAt;
    } else {
      groups.push({
        action,
        actorId: log.actorId,
        actorName: actorDisplayName(log.actor),
        logs: [log],
        newestAt: log.createdAt,
        oldestAt: log.createdAt,
      });
    }
  }

  return groups.map((g) => {
    // Earliest log id in the batch as the stable job key.
    const primary = g.logs.reduce((a, b) =>
      a.createdAt <= b.createdAt ? a : b
    );
    const count = g.logs.length;
    return {
      jobId: deriveJobId(primary.id),
      operation: OPERATION_LABELS[g.action] ?? g.action,
      module: "Employees",
      requestedBy: g.actorName,
      requestedOn: formatRequestedOn(g.oldestAt),
      duration: "—",
      status: "Completed" as const,
      affectedRecords: count === 1 ? "1 employee" : `${count} employees`,
    };
  });
}
