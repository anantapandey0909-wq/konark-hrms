/**
 * Export service — read-only preview and bounded synchronous generation.
 * companyId always from getTenantPrisma(); never from client.
 */

import type { AuthRole, AuthUser } from "@/types/auth";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as exportRepo from "@/lib/repositories/export.repository";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  buildCsv,
  buildJson,
  buildSpreadsheetMl,
  cellToString,
  estimateUtf8Bytes,
  formatByteSize,
} from "@/lib/export/formatters";
import {
  exportRequestSchema,
  MAX_EXPORT_ROWS,
  EXPORT_PREVIEW_SAMPLE_ROWS,
  type ExportColumn,
  type ExportFilters,
  type ExportFormat,
  type ExportGenerateResult,
  type ExportHistoryItem,
  type ExportModule,
  type ExportModuleSummary,
  type ExportPreviewResult,
  type ExportRequestInput,
} from "@/lib/validation/export";

const MODULE_META: Record<
  ExportModule,
  { name: string; description: string }
> = {
  employees: {
    name: "Employees",
    description: "Core profiles, job lines, metadata.",
  },
  departments: {
    name: "Departments",
    description: "Hierarchy bands, division structure.",
  },
  attendance: {
    name: "Attendance",
    description: "Clock checks and status records.",
  },
  leave: {
    name: "Leave",
    description: "Leave requests and status registers.",
  },
  payroll: {
    name: "Payroll",
    description: "Ledger components and payslip snapshots.",
  },
  reports: {
    name: "Reports",
    description: "High-level count snapshot for compliance.",
  },
};

function assertCanExport(user: AuthUser, module: ExportModule): void {
  const role = user.role as AuthRole;
  if (role === "EMPLOYEE") {
    throw new AppError(
      "FORBIDDEN",
      "Employees cannot use the Export Center."
    );
  }
  // Payroll is restricted to finance/HR leadership.
  if (module === "payroll") {
    const allowed: AuthRole[] = ["ADMIN", "HR", "ACCOUNTANT"];
    if (!allowed.includes(role) && !user.isSuperAdmin) {
      throw new AppError(
        "FORBIDDEN",
        "Payroll export requires HR, Accountant, or Admin role."
      );
    }
  }
}

function columnsFor(module: ExportModule): ExportColumn[] {
  switch (module) {
    case "employees":
      return [
        { key: "employeeCode", label: "Employee Code" },
        { key: "fullName", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "department", label: "Department" },
        { key: "designation", label: "Designation" },
        { key: "status", label: "Status" },
        { key: "joiningDate", label: "Joining Date" },
      ];
    case "departments":
      return [
        { key: "departmentCode", label: "Code" },
        { key: "departmentName", label: "Name" },
        { key: "status", label: "Status" },
        { key: "description", label: "Description" },
      ];
    case "attendance":
      return [
        { key: "employeeCode", label: "Employee Code" },
        { key: "employeeName", label: "Employee Name" },
        { key: "attendanceDate", label: "Date" },
        { key: "status", label: "Status" },
        { key: "checkIn", label: "Check In" },
        { key: "checkOut", label: "Check Out" },
        { key: "totalHours", label: "Total Hours" },
        { key: "workMode", label: "Work Mode" },
      ];
    case "leave":
      return [
        { key: "employeeCode", label: "Employee Code" },
        { key: "employeeName", label: "Employee Name" },
        { key: "leaveType", label: "Leave Type" },
        { key: "startDate", label: "Start" },
        { key: "endDate", label: "End" },
        { key: "totalDays", label: "Days" },
        { key: "status", label: "Status" },
        { key: "reason", label: "Reason" },
      ];
    case "payroll":
      return [
        { key: "payrollNumber", label: "Payroll Number" },
        { key: "employeeCode", label: "Employee Code" },
        { key: "employeeName", label: "Employee Name" },
        { key: "month", label: "Month" },
        { key: "year", label: "Year" },
        { key: "status", label: "Status" },
        { key: "basicSalary", label: "Basic" },
        { key: "grossSalary", label: "Gross" },
        { key: "netSalary", label: "Net" },
      ];
    case "reports":
      return [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ];
  }
}

async function loadTabular(
  companyId: string,
  module: ExportModule,
  filters: ExportFilters | undefined,
  take: number
): Promise<{ total: number; rows: Record<string, string>[] }> {
  switch (module) {
    case "employees": {
      const total = await exportRepo.countEmployees(companyId, filters);
      const data = await exportRepo.fetchEmployeesForExport(
        companyId,
        filters,
        take
      );
      return {
        total,
        rows: data.map((e) => ({
          employeeCode: cellToString(e.employeeCode),
          fullName: cellToString(`${e.firstName} ${e.lastName}`.trim()),
          email: cellToString(e.email),
          department: cellToString(e.department?.departmentName),
          designation: cellToString(e.designation),
          status: cellToString(e.status),
          joiningDate: cellToString(e.joiningDate),
        })),
      };
    }
    case "departments": {
      const total = await exportRepo.countDepartments(companyId, filters);
      const data = await exportRepo.fetchDepartmentsForExport(
        companyId,
        filters,
        take
      );
      return {
        total,
        rows: data.map((d) => ({
          departmentCode: cellToString(d.departmentCode),
          departmentName: cellToString(d.departmentName),
          status: cellToString(d.status),
          description: cellToString(d.description),
        })),
      };
    }
    case "attendance": {
      const total = await exportRepo.countAttendance(companyId, filters);
      const data = await exportRepo.fetchAttendanceForExport(
        companyId,
        filters,
        take
      );
      return {
        total,
        rows: data.map((a) => ({
          employeeCode: cellToString(a.employee?.employeeCode),
          employeeName: cellToString(
            `${a.employee?.firstName ?? ""} ${a.employee?.lastName ?? ""}`.trim()
          ),
          attendanceDate: cellToString(a.attendanceDate),
          status: cellToString(a.status),
          checkIn: a.checkIn ? a.checkIn.toISOString() : "",
          checkOut: a.checkOut ? a.checkOut.toISOString() : "",
          totalHours: cellToString(a.totalHours),
          workMode: cellToString(a.workMode),
        })),
      };
    }
    case "leave": {
      const total = await exportRepo.countLeave(companyId, filters);
      const data = await exportRepo.fetchLeaveForExport(
        companyId,
        filters,
        take
      );
      return {
        total,
        rows: data.map((l) => ({
          employeeCode: cellToString(l.employee?.employeeCode),
          employeeName: cellToString(
            `${l.employee?.firstName ?? ""} ${l.employee?.lastName ?? ""}`.trim()
          ),
          leaveType: cellToString(l.leaveType),
          startDate: cellToString(l.startDate),
          endDate: cellToString(l.endDate),
          totalDays: cellToString(l.totalDays),
          status: cellToString(l.status),
          reason: cellToString(l.reason),
        })),
      };
    }
    case "payroll": {
      const total = await exportRepo.countPayroll(companyId, filters);
      const data = await exportRepo.fetchPayrollForExport(
        companyId,
        filters,
        take
      );
      return {
        total,
        rows: data.map((p) => ({
          payrollNumber: cellToString(p.payrollNumber),
          employeeCode: cellToString(p.employeeCode),
          employeeName: cellToString(p.employeeName),
          month: cellToString(p.month),
          year: cellToString(p.year),
          status: cellToString(p.status),
          basicSalary: cellToString(p.basicSalary),
          grossSalary: cellToString(p.grossSalary),
          netSalary: cellToString(p.netSalary),
        })),
      };
    }
    case "reports": {
      const snap = await exportRepo.fetchReportSnapshot(companyId);
      return {
        total: snap.length,
        rows: snap.map((s) => ({
          metric: cellToString(s.metric),
          value: cellToString(s.value),
        })),
      };
    }
  }
}

function buildFilePayload(
  module: ExportModule,
  format: ExportFormat,
  columns: ExportColumn[],
  rows: Record<string, string>[]
): { body: string; mimeType: string; extension: string } {
  if (format === "csv") {
    return {
      body: buildCsv(columns, rows),
      mimeType: "text/csv;charset=utf-8",
      extension: "csv",
    };
  }
  if (format === "json") {
    return {
      body: buildJson(columns, rows),
      mimeType: "application/json;charset=utf-8",
      extension: "json",
    };
  }
  // SpreadsheetML — Excel-compatible without exceljs
  return {
    body: buildSpreadsheetMl(MODULE_META[module].name, columns, rows),
    mimeType: "application/vnd.ms-excel",
    extension: "xls",
  };
}

export async function listExportModuleSummaries(): Promise<
  ExportModuleSummary[]
> {
  const { companyId, user } = await getTenantPrisma();
  const modules = Object.keys(MODULE_META) as ExportModule[];

  const recent = await exportRepo.findRecentExportAudits(companyId, 50);
  const lastByModule = new Map<string, string>();
  for (const row of recent) {
    const meta = row.metadata as { module?: string } | null;
    if (meta?.module && !lastByModule.has(meta.module)) {
      lastByModule.set(meta.module, row.createdAt.toISOString());
    }
  }

  const summaries: ExportModuleSummary[] = [];
  for (const id of modules) {
    let available = true;
    try {
      assertCanExport(user, id);
    } catch {
      available = false;
    }

    let recordCount: number | null = null;
    if (available) {
      try {
        const { total } = await loadTabular(companyId, id, undefined, 1);
        recordCount = total;
      } catch {
        recordCount = null;
      }
    }

    summaries.push({
      id,
      name: MODULE_META[id].name,
      description: MODULE_META[id].description,
      recordCount,
      lastExportAt: lastByModule.get(id) ?? null,
      available,
    });
  }
  return summaries;
}

export async function previewExport(
  input: ExportRequestInput
): Promise<ExportPreviewResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = exportRequestSchema.parse(input);
  assertCanExport(user, parsed.module);

  const columns = columnsFor(parsed.module);
  const { total, rows } = await loadTabular(
    companyId,
    parsed.module,
    parsed.filters,
    EXPORT_PREVIEW_SAMPLE_ROWS
  );

  const exceedsLimit = total > MAX_EXPORT_ROWS;
  const samplePayload = buildFilePayload(
    parsed.module,
    parsed.format,
    columns,
    rows
  );
  const estimatedBytes =
    total === 0
      ? estimateUtf8Bytes(samplePayload.body)
      : Math.round(
          (estimateUtf8Bytes(samplePayload.body) / Math.max(rows.length, 1)) *
            Math.min(total, MAX_EXPORT_ROWS)
        );

  return {
    module: parsed.module,
    format: parsed.format,
    totalRows: total,
    exceedsLimit,
    maxRows: MAX_EXPORT_ROWS,
    estimatedBytes,
    columns,
    sampleRows: rows,
    generatedAt: new Date().toISOString(),
    canExport: total > 0 && !exceedsLimit,
    message: exceedsLimit
      ? `Result set exceeds the maximum of ${MAX_EXPORT_ROWS.toLocaleString()} rows. Narrow filters before exporting.`
      : total === 0
        ? "No records match the current selection."
        : undefined,
  };
}

export async function generateExport(
  input: ExportRequestInput
): Promise<ExportGenerateResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = exportRequestSchema.parse(input);
  assertCanExport(user, parsed.module);

  const columns = columnsFor(parsed.module);
  const { total, rows } = await loadTabular(
    companyId,
    parsed.module,
    parsed.filters,
    MAX_EXPORT_ROWS + 1
  );

  if (total === 0) {
    throw new AppError("VALIDATION", "No records to export.");
  }
  if (total > MAX_EXPORT_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Export limited to ${MAX_EXPORT_ROWS.toLocaleString()} rows. Narrow your filters and try again.`
    );
  }

  const payload = buildFilePayload(
    parsed.module,
    parsed.format,
    columns,
    rows
  );
  const contentBase64 = Buffer.from(payload.body, "utf8").toString("base64");
  const byteLength = estimateUtf8Bytes(payload.body);
  const generatedAt = new Date().toISOString();
  const exportId = `EXT-${Date.now().toString(36).toUpperCase()}`;
  const filename = `konark-${parsed.module}-${exportId}.${payload.extension}`;

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "DATA_EXPORTED",
    entity: "Export",
    entityId: exportId,
    metadata: {
      source: "export_center",
      module: parsed.module,
      format: parsed.format,
      recordCount: rows.length,
      byteLength,
      filename,
      filters: parsed.filters ?? {},
    },
  });

  return {
    success: true,
    exportId,
    filename,
    mimeType: payload.mimeType,
    contentBase64,
    recordCount: rows.length,
    byteLength,
    module: parsed.module,
    format: parsed.format,
    generatedAt,
  };
}

export async function listExportHistory(): Promise<ExportHistoryItem[]> {
  const { companyId, user } = await getTenantPrisma();
  // EMPLOYEE cannot view export history either
  if (user.role === "EMPLOYEE") {
    throw new AppError("FORBIDDEN", "Employees cannot view export history.");
  }

  const rows = await exportRepo.findExportAuditHistory(companyId, 25);
  return rows.map((row) => {
    const meta = (row.metadata ?? {}) as {
      module?: string;
      format?: string;
      recordCount?: number;
      byteLength?: number;
    };
    return {
      exportId: row.entityId ?? row.id.slice(0, 12),
      module: meta.module ?? "—",
      format: (meta.format ?? "csv").toUpperCase(),
      requestedBy: row.actor?.email ?? row.actorId ?? "Unknown",
      date: row.createdAt.toISOString(),
      status: "Completed" as const,
      size:
        typeof meta.byteLength === "number"
          ? formatByteSize(meta.byteLength)
          : "—",
      recordCount: meta.recordCount,
    };
  });
}
