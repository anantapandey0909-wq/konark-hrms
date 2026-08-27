/**
 * Import History service — maps tenant AuditLog rows into HistoryJobItem.
 *
 * Truthfulness rules:
 * - Only values present in AuditLog (or derived labels from known action strings).
 * - Duration is never stored → "—".
 * - Filename only when metadata.filename exists (exports); otherwise "—".
 * - Failed/skipped/warnings only when metadata provides them; else 0.
 * - Successful imports/exports only write audit logs → status is Completed.
 * - Payroll/department CSV import write one audit per row → group by actor+action+5s.
 * - Bulk ops reuse the same 5s grouping window as bulk-history.service.
 */

import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import {
  findHistoryAuditLogs,
  type HistoryAuditAction,
} from "@/lib/repositories/import-history.repository";

/** Matches HistoryJobItem in the History dashboard UI. */
export type HistoryJobItem = {
  id: string;
  operation: "Import" | "Export";
  module: string;
  fileName: string;
  requestedBy: string;
  startedAt: string;
  completedAt: string;
  duration: string;
  status: "Completed" | "Running" | "Queued" | "Failed" | "Cancelled";
  rowsProcessed: string;
  fileType: string;
  importedRows: number;
  failedRows: number;
  skippedRows: number;
  warnings: number;
};

const GROUP_WINDOW_MS = 5_000;

const BULK_ACTIONS = new Set<string>([
  "BULK_EMPLOYEE_ACTIVATED",
  "BULK_EMPLOYEE_DEACTIVATED",
  "BULK_EMPLOYEE_DEPARTMENT_TRANSFERRED",
  "BULK_EMPLOYEE_MANAGER_ASSIGNED",
]);

const PER_RECORD_IMPORT_ACTIONS = new Set<string>([
  "DEPARTMENT_CREATED",
  "PAYROLL_CREATED",
]);

type Meta = Record<string, unknown>;

function asMeta(value: unknown): Meta {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Meta;
  }
  return {};
}

function num(meta: Meta, key: string): number | undefined {
  const v = meta[key];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function str(meta: Meta, key: string): string | undefined {
  const v = meta[key];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function formatWhen(date: Date): string {
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
    return actor.employee.firstName + " " + actor.employee.lastName;
  }
  return actor.email;
}

function deriveJobId(prefix: string, primaryLogId: string): string {
  const compact = primaryLogId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return prefix + "-" + compact;
}

function moduleForAction(action: string, meta: Meta): string {
  switch (action) {
    case "EMPLOYEES_IMPORTED":
      return "Employees";
    case "LEAVE_IMPORT_COMPLETED":
      return "Leave";
    case "ATTENDANCE_IMPORTED":
      return "Attendance";
    case "DEPARTMENT_CREATED":
      return "Departments";
    case "PAYROLL_CREATED":
      return "Payroll";
    case "DATA_EXPORTED": {
      const mod = str(meta, "module");
      if (!mod) return "Export";
      return mod.charAt(0).toUpperCase() + mod.slice(1);
    }
    case "BULK_EMPLOYEE_ACTIVATED":
      return "Bulk · Activate";
    case "BULK_EMPLOYEE_DEACTIVATED":
      return "Bulk · Deactivate";
    case "BULK_EMPLOYEE_DEPARTMENT_TRANSFERRED":
      return "Bulk · Transfer";
    case "BULK_EMPLOYEE_MANAGER_ASSIGNED":
      return "Bulk · Manager";
    default:
      return action;
  }
}

function fileTypeFor(action: string, meta: Meta): string {
  if (action === "DATA_EXPORTED") {
    const format = str(meta, "format");
    if (format === "csv") return "CSV (.csv)";
    if (format === "json") return "JSON (.json)";
    if (format === "xlsx" || format === "xls") return "Excel (.xls)";
    return format ? format.toUpperCase() : "—";
  }
  // Imports are CSV-driven in this product; filename is not stored in audit.
  return "CSV";
}

function operationFor(action: string): "Import" | "Export" {
  return action === "DATA_EXPORTED" ? "Export" : "Import";
}

type LogRow = Awaited<ReturnType<typeof findHistoryAuditLogs>>[number];

type Group = {
  action: HistoryAuditAction;
  actorId: string | null;
  actorName: string;
  logs: LogRow[];
  newestAt: Date;
  oldestAt: Date;
};

function shouldGroup(action: string): boolean {
  return BULK_ACTIONS.has(action) || PER_RECORD_IMPORT_ACTIONS.has(action);
}

function isCsvImportSource(meta: Meta): boolean {
  const source = str(meta, "source");
  return source === "csv_import" || source === undefined;
}

/**
 * Filter PAYROLL_CREATED / DEPARTMENT_CREATED to CSV-import provenance when
 * metadata.source is present. Rows without source are included (legacy).
 * Manual single creates from UI also use these actions; without source they
 * appear in history — accepted limitation without schema change.
 */
function includeLog(log: LogRow): boolean {
  if (!PER_RECORD_IMPORT_ACTIONS.has(log.action)) return true;
  const meta = asMeta(log.metadata);
  return isCsvImportSource(meta);
}

function groupLogs(logs: LogRow[]): Group[] {
  const groups: Group[] = [];

  for (const log of logs) {
    if (!includeLog(log)) continue;

    const action = log.action as HistoryAuditAction;
    const last = groups[groups.length - 1];

    if (shouldGroup(action) && last) {
      const canMerge =
        last.action === action &&
        last.actorId === log.actorId &&
        Math.abs(last.oldestAt.getTime() - log.createdAt.getTime()) <=
          GROUP_WINDOW_MS;

      if (canMerge) {
        last.logs.push(log);
        if (log.createdAt < last.oldestAt) last.oldestAt = log.createdAt;
        if (log.createdAt > last.newestAt) last.newestAt = log.createdAt;
        continue;
      }
    }

    // Batch-level actions (EMPLOYEES_IMPORTED, etc.) and DATA_EXPORTED: one job each.
    groups.push({
      action,
      actorId: log.actorId,
      actorName: actorDisplayName(log.actor),
      logs: [log],
      newestAt: log.createdAt,
      oldestAt: log.createdAt,
    });
  }

  return groups;
}

function mapGroupToJob(g: Group): HistoryJobItem {
  const primary = g.logs.reduce((a, b) =>
    a.createdAt <= b.createdAt ? a : b
  );
  const meta = asMeta(primary.metadata);
  const action = g.action;

  const importedFromMeta =
    num(meta, "importedCount") ??
    num(meta, "recordCount") ??
    (shouldGroup(action) ? g.logs.length : undefined);

  const totalRows = num(meta, "totalRows");
  const failedRows = num(meta, "failedCount") ?? 0;
  const skippedRows = num(meta, "skippedCount") ?? 0;
  const warnings = num(meta, "warnings") ?? 0;

  const importedRows = importedFromMeta ?? 0;
  const rowsLabel =
    totalRows != null
      ? totalRows.toLocaleString() + " rows"
      : importedRows > 0
        ? importedRows.toLocaleString() + " rows"
        : "—";

  const fileName =
    str(meta, "filename") ??
    (action === "DATA_EXPORTED"
      ? "export-" + (str(meta, "module") ?? "data")
      : "—");

  const prefix =
    action === "DATA_EXPORTED"
      ? "EXP"
      : BULK_ACTIONS.has(action)
        ? "BCH"
        : "IMP";

  const when = formatWhen(g.oldestAt);

  return {
    id: deriveJobId(prefix, primary.id),
    operation: operationFor(action),
    module: moduleForAction(action, meta),
    fileName,
    requestedBy: g.actorName,
    startedAt: when,
    completedAt: formatWhen(g.newestAt),
    duration: "—",
    status: "Completed",
    rowsProcessed: rowsLabel,
    fileType: fileTypeFor(action, meta),
    importedRows,
    failedRows,
    skippedRows,
    warnings,
  };
}

export async function listImportHistory(options?: {
  limit?: number;
}): Promise<HistoryJobItem[]> {
  const { companyId } = await getTenantPrisma();
  const logs = await findHistoryAuditLogs(companyId, {
    limit: options?.limit ?? 150,
  });

  if (logs.length === 0) return [];

  const groups = groupLogs(logs);
  return groups.map(mapGroupToJob);
}
