/**
 * Payroll import service — validates rows, resolves employee codes within the
 * authenticated tenant, reuses existing salary calculation defaults, derives
 * pay periods, creates DRAFT payroll records only (create-only, no overwrite).
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

  const companyEmployees = await employeeRepo.findEmployeesByCompany(companyId);
  const byCode = new Map(
    companyEmployees.map((e) => [e.employeeCode.toLowerCase(), e])
  );

  const seenKeys = new Set<string>();
  const errors: PayrollImportRowError[] = [];

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

  const prepared: Prepared[] = [];

  for (const row of parsed.rows) {
    const codeKey = row.employeeId.trim().toLowerCase();
    const dupKey = `${codeKey}|${row.month}|${row.year}`;

    if (seenKeys.has(dupKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message:
          "Duplicate payroll entry in import file for this employee, month, and year.",
      });
      continue;
    }

    const employee = byCode.get(codeKey);
    if (!employee) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        field: "employeeId",
        message: "Employee not found in your organization.",
      });
      continue;
    }

    const existing = await payrollRepo.findPayrollByEmployeePeriod(
      companyId,
      employee.id,
      row.month,
      row.year
    );
    if (existing) {
      errors.push({
        rowNumber: row.rowNumber,
        employeeId: row.employeeId,
        message:
          "A payroll record already exists for this employee, month, and year.",
      });
      continue;
    }

    const bounds = payPeriodBounds(row.month, row.year);
    const salary = resolveSalaryComponents(row.basicSalary);
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

  const importedIds: string[] = [];

  if (prepared.length > 0) {
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
          ? "A payroll record already exists for one of the employees in this batch."
          : "Failed to commit payroll records. Please try again.";
      throw new AppError(
        err instanceof Error && err.message.includes("Unique")
          ? "CONFLICT"
          : "INTERNAL",
        message
      );
    }

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
  }

  return {
    success: importedIds.length > 0 && errors.length === 0,
    importedCount: importedIds.length,
    failedCount: errors.length,
    skippedCount: errors.length,
    totalRows: parsed.rows.length,
    errors,
    importedIds,
  };
}
