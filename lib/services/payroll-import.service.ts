/**
 * Payroll import service — preview (read-only) and transactional commit.
 *
 * Rules:
 * - companyId from getTenantPrisma() only
 * - Preview never mutates
 * - Commit is all-or-nothing: any invalid row blocks the entire import
 * - Salary via resolveSalaryComponents; periods via payPeriodBounds
 * - Status always DRAFT (never from CSV)
 * - Create-only (no overwrite of existing employee+month+year)
 */

import type { Prisma, PayrollMonth } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import * as payrollRepo from "@/lib/repositories/payroll.repository";
import * as payrollImportRepo from "@/lib/repositories/payroll-import.repository";
import { payPeriodBounds } from "@/lib/payroll/formatters";
import {
  resolveSalaryComponents,
  generatePayrollNumber,
} from "@/lib/payroll/salary-defaults";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  payrollImportBatchSchema,
  type PayrollImportBatchInput,
  type PayrollImportPreviewResult,
  type PayrollImportResult,
  type PayrollImportRowError,
  type PayrollImportRowInput,
  PAYROLL_IMPORT_MAX_ROWS,
} from "@/lib/validation/payroll-import";

function parseDateOnly(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

const defaultAttendance = {
  workingDays: 22,
  presentDays: 20,
  absentDays: 0,
  paidLeaveDays: 2,
  unpaidLeaveDays: 0,
  overtimeHours: 0,
  lateEntries: 0,
};

const defaultLeave = {
  totalLeaves: 2,
  paidLeaves: 2,
  unpaidLeaves: 0,
  leaveWithoutPayDays: 0,
};

type Prepared = {
  row: PayrollImportRowInput;
  employeeDbId: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  departmentName: string | null;
  payrollNumber: string;
  bounds: { startIso: string; endIso: string };
  salary: ReturnType<typeof resolveSalaryComponents>;
};

/** Load all tenant employees for import code lookup (paginated repo API). */
async function loadAllCompanyEmployees(companyId: string) {
  const first = await employeeRepo.findEmployeesByCompany(
    companyId,
    {},
    { page: 1, pageSize: 1 }
  );
  if (first.total === 0) return [];
  const { items } = await employeeRepo.findEmployeesByCompany(
    companyId,
    {},
    { page: 1, pageSize: first.total }
  );
  return items;
}

async function validatePayrollImportBatch(
  companyId: string,
  rows: PayrollImportRowInput[]
): Promise<{
  prepared: Prepared[];
  errors: PayrollImportRowError[];
  duplicateCount: number;
}> {
  const companyEmployees = await loadAllCompanyEmployees(companyId);
  const byCode = new Map(
    companyEmployees.map((e) => [e.employeeCode.toLowerCase(), e])
  );

  // Resolve codes first for batch payroll conflict lookup.
  const resolved: {
    row: PayrollImportRowInput;
    employeeDbId: string;
    month: PayrollMonth;
    year: number;
  }[] = [];

  for (const row of rows) {
    const employee = byCode.get(row.employeeId.trim().toLowerCase());
    if (employee) {
      resolved.push({
        row,
        employeeDbId: employee.id,
        month: row.month as PayrollMonth,
        year: row.year,
      });
    }
  }

  const existingRows = await payrollRepo.findPayrollsByEmployeePeriods(
    companyId,
    resolved.map((r) => r.employeeDbId),
    resolved.map((r) => r.month),
    resolved.map((r) => r.year)
  );

  const existingKeys = new Set(
    existingRows.map((p) => `${p.employeeId}|${p.month}|${p.year}`)
  );

  const seenKeys = new Set<string>();
  const prepared: Prepared[] = [];
  const errors: PayrollImportRowError[] = [];
  let duplicateCount = 0;

  for (const row of rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const dupKey = `${codeKey}|${row.month}|${row.year}`;
    let rowFailed = false;

    if (seenKeys.has(dupKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "month",
        message:
          "Duplicate payroll entry in import file for this employee, month, and year.",
      });
      duplicateCount++;
      rowFailed = true;
    }

    const employee = byCode.get(codeKey);
    if (!employee) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Employee not found in your organization.",
      });
      rowFailed = true;
    } else if (employee.status === "TERMINATED") {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Cannot import payroll for a terminated employee.",
      });
      rowFailed = true;
    }

    if (rowFailed || !employee) {
      continue;
    }

    const existingKey = `${employee.id}|${row.month}|${row.year}`;
    if (existingKeys.has(existingKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "month",
        message:
          "A payroll record already exists for this employee, month, and year.",
      });
      duplicateCount++;
      continue;
    }

    let salary: ReturnType<typeof resolveSalaryComponents>;
    let bounds: { startIso: string; endIso: string };
    try {
      bounds = payPeriodBounds(row.month, row.year);
      salary = resolveSalaryComponents(row.basicSalary);
    } catch {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "basicSalary",
        message: "Unable to calculate salary components for this row.",
      });
      continue;
    }

    if (
      !Number.isFinite(salary.grossSalary) ||
      !Number.isFinite(salary.netSalary) ||
      salary.grossSalary <= 0
    ) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "basicSalary",
        message: "Calculated salary values are invalid.",
      });
      continue;
    }

    const payrollNumber = generatePayrollNumber(
      row.year,
      row.month,
      employee.employeeCode
    );

    seenKeys.add(dupKey);
    prepared.push({
      row,
      employeeDbId: employee.id,
      employeeCode: employee.employeeCode,
      employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
      designation: employee.designation,
      departmentName: employee.department?.departmentName ?? null,
      payrollNumber,
      bounds,
      salary,
    });
  }

  return { prepared, errors, duplicateCount };
}

export async function previewPayrollImport(
  input: PayrollImportBatchInput
): Promise<PayrollImportPreviewResult> {
  const { companyId } = await getTenantPrisma();
  const parsed = payrollImportBatchSchema.parse(input);

  if (parsed.rows.length > PAYROLL_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${PAYROLL_IMPORT_MAX_ROWS} rows.`
    );
  }

  const { prepared, errors, duplicateCount } =
    await validatePayrollImportBatch(companyId, parsed.rows);

  const invalidRowNumbers = new Set(errors.map((e) => e.rowNumber));

  return {
    totalRows: parsed.rows.length,
    validCount: prepared.length,
    invalidCount: invalidRowNumbers.size,
    duplicateCount,
    canCommit: prepared.length > 0 && errors.length === 0,
    errors,
    validRowNumbers: prepared.map((p) => p.row.rowNumber),
  };
}

export async function importPayrollRecords(
  input: PayrollImportBatchInput
): Promise<PayrollImportResult> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = payrollImportBatchSchema.parse(input);

  if (parsed.rows.length > PAYROLL_IMPORT_MAX_ROWS) {
    throw new AppError(
      "VALIDATION",
      `Import is limited to ${PAYROLL_IMPORT_MAX_ROWS} rows.`
    );
  }

  const { prepared, errors } = await validatePayrollImportBatch(
    companyId,
    parsed.rows
  );

  // All-or-nothing: any invalid row blocks the entire commit.
  if (errors.length > 0 || prepared.length === 0) {
    return {
      success: false,
      importedCount: 0,
      failedCount: errors.length || parsed.rows.length,
      skippedCount: errors.length || parsed.rows.length,
      totalRows: parsed.rows.length,
      errors:
        errors.length > 0
          ? errors
          : [
              {
                rowNumber: 0,
                message: "No valid rows to import.",
              },
            ],
      importedIds: [],
    };
  }

  if (prepared.length !== parsed.rows.length) {
    return {
      success: false,
      importedCount: 0,
      failedCount: errors.length,
      skippedCount: errors.length,
      totalRows: parsed.rows.length,
      errors,
      importedIds: [],
    };
  }

  const importedIds: string[] = [];

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of prepared) {
        const created = await payrollImportRepo.createPayrollInTx(tx, {
          payrollNumber: item.payrollNumber,
          month: item.row.month as PayrollMonth,
          year: item.row.year,
          payPeriodStart: parseDateOnly(item.bounds.startIso),
          payPeriodEnd: parseDateOnly(item.bounds.endIso),
          employeeCode: item.employeeCode,
          employeeName: item.employeeName,
          designation: item.designation,
          departmentName: item.departmentName,
          basicSalary: item.row.basicSalary,
          grossSalary: item.salary.grossSalary,
          netSalary: item.salary.netSalary,
          totalAllowances: item.salary.totalAllowances,
          totalDeductions: item.salary.totalDeductions,
          taxableIncome: item.salary.taxableIncome,
          allowances: item.salary.allowances as unknown as Prisma.InputJsonValue,
          deductions: item.salary.deductions as unknown as Prisma.InputJsonValue,
          attendanceSummary:
            defaultAttendance as unknown as Prisma.InputJsonValue,
          leaveSummary: defaultLeave as unknown as Prisma.InputJsonValue,
          notes:
            item.row.notes && String(item.row.notes).trim()
              ? String(item.row.notes).trim()
              : null,
          companyId,
          employeeId: item.employeeDbId,
        });
        importedIds.push(created.id);
      }
    });
  } catch (err) {
    console.error("[payroll-import] transaction failed", err);
    const message =
      err instanceof Error && err.message.includes("Unique")
        ? "A payroll record already exists for one of the employees in this batch. No rows were imported."
        : "Failed to commit payroll import. No rows were imported.";
    throw new AppError(
      err instanceof Error && err.message.includes("Unique")
        ? "CONFLICT"
        : "INTERNAL",
      message
    );
  }

  // Audit only after successful transaction.
  for (let i = 0; i < prepared.length; i++) {
    const item = prepared[i];
    const id = importedIds[i];
    if (!id) continue;
    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "PAYROLL_CREATED",
      entity: "Payroll",
      entityId: id,
      metadata: {
        source: "csv_import",
        employeeId: item.employeeDbId,
        employeeCode: item.employeeCode,
        month: item.row.month,
        year: item.row.year,
        payrollNumber: item.payrollNumber,
        basicSalary: item.row.basicSalary,
        grossSalary: item.salary.grossSalary,
        netSalary: item.salary.netSalary,
      },
    });
  }

  return {
    success: true,
    importedCount: importedIds.length,
    failedCount: 0,
    skippedCount: 0,
    totalRows: parsed.rows.length,
    errors: [],
    importedIds,
  };
}
