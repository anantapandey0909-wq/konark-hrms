/**
 * Payroll service — business rules, tenant isolation, audit.
 *
 * Salary arithmetic is always derived from the line items that are stored:
 *   totalAllowances = sum(allowances.amount)
 *   totalDeductions = sum(deductions.amount)
 *   grossSalary     = basicSalary + totalAllowances
 *   netSalary       = max(0, grossSalary - totalDeductions)
 *   taxableIncome   = max(0, grossSalary - totalDeductions)
 *
 * Client-provided aggregate totals are never trusted when they disagree with
 * the allowance/deduction arrays (that caused payslip inconsistency).
 */

import type { Prisma, PayrollMonth, PayrollStatus } from "@prisma/client";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as payrollRepo from "@/lib/repositories/payroll.repository";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import { mapPayrollToFrontend } from "@/lib/mappers/payroll.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  createPayrollSchema,
  updatePayrollSchema,
  type CreatePayrollInput,
  type UpdatePayrollInput,
} from "@/lib/validation/payroll";
import {
  calculateGrossSalary,
  calculateNetSalary,
} from "@/lib/payroll";
import type {
  PayrollRecord,
  PayrollSummary,
  PayrollStats,
  PayrollAllowance,
  PayrollDeduction,
  PayrollAttendanceSummary,
  PayrollLeaveSummary,
} from "@/types/payroll";

function parseDateOnly(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

function defaultAllowances(basic: number): PayrollAllowance[] {
  return [
    {
      id: "all-hra",
      name: "House Rent Allowance",
      amount: Math.round(basic * 0.4),
    },
    {
      id: "all-lta",
      name: "Leave Travel Allowance",
      amount: Math.round(basic * 0.1),
    },
    { id: "all-spl", name: "Special Allowance", amount: 500 },
  ];
}

function defaultDeductions(basic: number): PayrollDeduction[] {
  return [
    {
      id: "ded-pf",
      name: "Provident Fund",
      amount: Math.round(basic * 0.12),
    },
    { id: "ded-tax", name: "Professional Tax", amount: 200 },
    { id: "ded-ins", name: "Health Insurance", amount: 150 },
  ];
}

function sumLineItems(items: readonly { amount: number }[]): number {
  return items.reduce((s, i) => s + i.amount, 0);
}

/**
 * Single source of truth for salary components stored on Payroll.
 * Line items drive totals; aggregates are never taken from the client alone.
 */
function resolveSalaryComponents(
  basicSalary: number,
  options?: {
    allowances?: PayrollAllowance[];
    deductions?: PayrollDeduction[];
  }
): {
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  totalAllowances: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  taxableIncome: number;
} {
  const allowances =
    options?.allowances && options.allowances.length > 0
      ? options.allowances
      : defaultAllowances(basicSalary);
  const deductions =
    options?.deductions && options.deductions.length > 0
      ? options.deductions
      : defaultDeductions(basicSalary);

  const totalAllowances = sumLineItems(allowances);
  const totalDeductions = sumLineItems(deductions);
  const grossSalary = calculateGrossSalary(basicSalary, totalAllowances);
  const netSalary = calculateNetSalary(grossSalary, totalDeductions);
  const taxableIncome = Math.max(0, Math.round((grossSalary - totalDeductions) * 100) / 100);

  return {
    allowances,
    deductions,
    totalAllowances,
    totalDeductions,
    grossSalary,
    netSalary,
    taxableIncome,
  };
}

function defaultAttendance(): PayrollAttendanceSummary {
  return {
    workingDays: 22,
    presentDays: 20,
    absentDays: 0,
    paidLeaveDays: 2,
    unpaidLeaveDays: 0,
    overtimeHours: 0,
    lateEntries: 0,
  };
}

function defaultLeave(): PayrollLeaveSummary {
  return {
    totalLeaves: 2,
    paidLeaves: 2,
    unpaidLeaves: 0,
    leaveWithoutPayDays: 0,
  };
}

function monthCode(month: string): string {
  const map: Record<string, string> = {
    JANUARY: "01",
    FEBRUARY: "02",
    MARCH: "03",
    APRIL: "04",
    MAY: "05",
    JUNE: "06",
    JULY: "07",
    AUGUST: "08",
    SEPTEMBER: "09",
    OCTOBER: "10",
    NOVEMBER: "11",
    DECEMBER: "12",
  };
  return map[month] ?? "01";
}

function generatePayrollNumber(
  year: number,
  month: string,
  employeeCode: string
): string {
  const suffix = employeeCode.replace(/[^A-Za-z0-9]/g, "").slice(-6) || "000000";
  return `PAY-${year}-${monthCode(month)}-${suffix}-${Date.now().toString(36).toUpperCase()}`;
}

const PAID_IMMUTABLE = new Set(["PAID"]);

export async function listPayrollRecords(filters?: {
  search?: string;
  status?: string;
  month?: string;
  year?: number;
  departmentId?: string;
  employeeId?: string;
}): Promise<PayrollRecord[]> {
  const { companyId } = await getTenantPrisma();
  const rows = await payrollRepo.findPayrollsByCompany(companyId, filters ?? {});
  return rows.map(mapPayrollToFrontend);
}

export async function getPayrollRecord(id: string): Promise<PayrollRecord> {
  const { companyId } = await getTenantPrisma();
  const row = await payrollRepo.findPayrollById(companyId, id);
  if (!row) {
    throw new AppError("NOT_FOUND", "Payroll record not found.", 404);
  }
  return mapPayrollToFrontend(row);
}

export async function getPayrollDashboardStats(): Promise<{
  summary: PayrollSummary;
  stats: PayrollStats;
}> {
  const { companyId } = await getTenantPrisma();
  const [groups, agg] = await Promise.all([
    payrollRepo.countPayrollsByStatus(companyId),
    payrollRepo.aggregatePayrollAmounts(companyId),
  ]);

  const byStatus: Record<string, number> = {};
  for (const g of groups) {
    byStatus[g.status] = g._count._all;
  }

  const total = agg._count._all;
  const summary: PayrollSummary = {
    totalPayrollRecords: total,
    totalEmployees: total,
    paidPayroll: byStatus.PAID ?? 0,
    pendingPayroll: byStatus.PENDING ?? 0,
    approvedPayroll: byStatus.APPROVED ?? 0,
    draftPayroll: byStatus.DRAFT ?? 0,
  };

  const stats: PayrollStats = {
    employeeCount: total,
    totalGrossSalary: agg._sum.grossSalary ?? 0,
    totalNetSalary: agg._sum.netSalary ?? 0,
    totalAllowances: agg._sum.totalAllowances ?? 0,
    totalDeductions: agg._sum.totalDeductions ?? 0,
    averageNetSalary: Math.round((agg._avg.netSalary ?? 0) * 100) / 100,
  };

  return { summary, stats };
}

export async function createPayrollRecord(
  input: CreatePayrollInput
): Promise<PayrollRecord> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = createPayrollSchema.parse(input);

  const employee = await employeeRepo.findEmployeeById(
    companyId,
    parsed.employeeId
  );
  if (!employee) {
    throw new AppError(
      "VALIDATION",
      "Employee not found in your organization."
    );
  }

  const duplicate = await payrollRepo.findPayrollByEmployeePeriod(
    companyId,
    parsed.employeeId,
    parsed.month,
    parsed.year
  );
  if (duplicate) {
    throw new AppError(
      "CONFLICT",
      "A payroll record already exists for this employee, month, and year."
    );
  }

  const start = parseDateOnly(parsed.payPeriodStart);
  const end = parseDateOnly(parsed.payPeriodEnd);
  if (end < start) {
    throw new AppError(
      "VALIDATION",
      "Pay period end cannot be before start."
    );
  }

  const basic = parsed.basicSalary;
  const salary = resolveSalaryComponents(basic, {
    allowances: parsed.allowances,
    deductions: parsed.deductions,
  });

  const attendanceSummary = parsed.attendanceSummary ?? defaultAttendance();
  const leaveSummary = parsed.leaveSummary ?? defaultLeave();

  const employeeName = `${employee.firstName} ${employee.lastName}`.trim();
  const departmentName = employee.department?.departmentName ?? null;
  const payrollNumber = generatePayrollNumber(
    parsed.year,
    parsed.month,
    employee.employeeCode
  );

  const status = (parsed.status ?? "DRAFT") as PayrollStatus;

  const created = await payrollRepo.createPayroll({
    payrollNumber,
    month: parsed.month as PayrollMonth,
    year: parsed.year,
    status,
    payPeriodStart: start,
    payPeriodEnd: end,
    employeeCode: employee.employeeCode,
    employeeName,
    designation: employee.designation,
    departmentName,
    basicSalary: basic,
    grossSalary: salary.grossSalary,
    netSalary: salary.netSalary,
    totalAllowances: salary.totalAllowances,
    totalDeductions: salary.totalDeductions,
    taxableIncome: salary.taxableIncome,
    allowances: salary.allowances as unknown as Prisma.InputJsonValue,
    deductions: salary.deductions as unknown as Prisma.InputJsonValue,
    attendanceSummary: attendanceSummary as unknown as Prisma.InputJsonValue,
    leaveSummary: leaveSummary as unknown as Prisma.InputJsonValue,
    generatedAt: new Date(),
    paidAt: status === "PAID" ? new Date() : null,
    notes: parsed.notes ?? null,
    company: { connect: { id: companyId } },
    employee: { connect: { id: employee.id } },
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "PAYROLL_CREATED",
    entity: "Payroll",
    entityId: created.id,
    metadata: {
      employeeId: employee.id,
      month: parsed.month,
      year: parsed.year,
      payrollNumber,
      basicSalary: basic,
      totalAllowances: salary.totalAllowances,
      totalDeductions: salary.totalDeductions,
      netSalary: salary.netSalary,
    },
  });

  return mapPayrollToFrontend(created);
}

export async function updatePayrollRecord(
  id: string,
  input: UpdatePayrollInput
): Promise<PayrollRecord> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = updatePayrollSchema.parse(input);

  const existing = await payrollRepo.findPayrollById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Payroll record not found.", 404);
  }

  if (PAID_IMMUTABLE.has(existing.status) && parsed.status !== "CANCELLED") {
    if (
      parsed.basicSalary !== undefined ||
      parsed.totalAllowances !== undefined ||
      parsed.totalDeductions !== undefined ||
      parsed.grossSalary !== undefined ||
      parsed.netSalary !== undefined ||
      parsed.allowances !== undefined ||
      parsed.deductions !== undefined
    ) {
      throw new AppError(
        "CONFLICT",
        "Paid payroll amounts cannot be modified. Cancel the record first if required."
      );
    }
  }

  const nextStatus = (parsed.status ?? existing.status) as PayrollStatus;

  if (existing.status === "CANCELLED" && nextStatus !== "CANCELLED") {
    throw new AppError(
      "CONFLICT",
      "Cancelled payroll records cannot be reactivated."
    );
  }

  const basic = parsed.basicSalary ?? existing.basicSalary;

  // Prefer explicit line items from the client; otherwise recompute defaults
  // when basic salary changed; otherwise keep existing JSON arrays.
  let allowancesOpt: PayrollAllowance[] | undefined = parsed.allowances;
  let deductionsOpt: PayrollDeduction[] | undefined = parsed.deductions;

  if (!allowancesOpt && parsed.basicSalary !== undefined) {
    allowancesOpt = defaultAllowances(basic);
  }
  if (!deductionsOpt && parsed.basicSalary !== undefined) {
    deductionsOpt = defaultDeductions(basic);
  }

  if (!allowancesOpt) {
    // Keep existing line items from DB JSON
    const existingAll = existing.allowances;
    if (Array.isArray(existingAll) && existingAll.length > 0) {
      allowancesOpt = existingAll as unknown as PayrollAllowance[];
    }
  }
  if (!deductionsOpt) {
    const existingDed = existing.deductions;
    if (Array.isArray(existingDed) && existingDed.length > 0) {
      deductionsOpt = existingDed as unknown as PayrollDeduction[];
    }
  }

  const salary = resolveSalaryComponents(basic, {
    allowances: allowancesOpt,
    deductions: deductionsOpt,
  });

  const data: Prisma.PayrollUpdateInput = {
    status: nextStatus,
    basicSalary: basic,
    totalAllowances: salary.totalAllowances,
    totalDeductions: salary.totalDeductions,
    grossSalary: salary.grossSalary,
    netSalary: salary.netSalary,
    taxableIncome: salary.taxableIncome,
    allowances: salary.allowances as unknown as Prisma.InputJsonValue,
    deductions: salary.deductions as unknown as Prisma.InputJsonValue,
  };

  if (parsed.payPeriodStart) {
    data.payPeriodStart = parseDateOnly(parsed.payPeriodStart);
  }
  if (parsed.payPeriodEnd) {
    data.payPeriodEnd = parseDateOnly(parsed.payPeriodEnd);
  }
  if (parsed.attendanceSummary) {
    data.attendanceSummary =
      parsed.attendanceSummary as unknown as Prisma.InputJsonValue;
  }
  if (parsed.leaveSummary) {
    data.leaveSummary =
      parsed.leaveSummary as unknown as Prisma.InputJsonValue;
  }
  if (parsed.notes !== undefined) {
    data.notes = parsed.notes;
  }

  if (nextStatus === "PAID" && !existing.paidAt) {
    data.paidAt = new Date();
  }

  const updated = await payrollRepo.updatePayroll(companyId, id, data);
  if (!updated) {
    throw new AppError("NOT_FOUND", "Payroll record not found.", 404);
  }

  let auditAction = "PAYROLL_UPDATED";
  if (parsed.status === "APPROVED" && existing.status !== "APPROVED") {
    auditAction = "PAYROLL_APPROVED";
  } else if (parsed.status === "PAID" && existing.status !== "PAID") {
    auditAction = "PAYROLL_PAID";
  } else if (parsed.status === "CANCELLED" && existing.status !== "CANCELLED") {
    auditAction = "PAYROLL_CANCELLED";
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: auditAction,
    entity: "Payroll",
    entityId: id,
    metadata: {
      fromStatus: existing.status,
      toStatus: nextStatus,
      basicSalary: basic,
      totalAllowances: salary.totalAllowances,
      totalDeductions: salary.totalDeductions,
      netSalary: salary.netSalary,
    },
  });

  return mapPayrollToFrontend(updated);
}
