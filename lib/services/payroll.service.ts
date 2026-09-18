/**
 * Payroll service — business rules, tenant isolation, audit.
 *
 * Salary arithmetic is always derived server-side from basic salary
 * via default allowance/deduction line items (client line amounts are not trusted).
 * Pay period dates are always derived from month + year on create.
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
import { payPeriodBounds } from "@/lib/payroll/formatters";
import {
  resolveSalaryComponents,
  generatePayrollNumber,
} from "@/lib/payroll/salary-defaults";
import { getPermissions } from "@/lib/auth/permissions";
import type { AuthUser } from "@/types/auth";
import type {
  PayrollRecord,
  PayrollSummary,
  PayrollStats,
  PayrollAttendanceSummary,
  PayrollLeaveSummary,
} from "@/types/payroll";

export type PayrollListResult = {
  items: PayrollRecord[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
/** Cap for self-service stats full-row load (one employee, bounded). */
const SELF_STATS_MAX_ROWS = 500;

function clampPage(page?: number): number {
  if (typeof page !== "number" || !Number.isFinite(page)) return DEFAULT_PAGE;
  return Math.max(1, Math.floor(page));
}

function clampPageSize(pageSize?: number): number {
  if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(pageSize)));
}

function parseDateOnly(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
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

const PAID_IMMUTABLE = new Set(["PAID"]);

function hasOrgPayrollAccess(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  const p = getPermissions(user.role);
  return p.payroll.generate || p.payroll.approve || p.payroll.upload;
}

function canApprovePayroll(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  return getPermissions(user.role).payroll.approve;
}

async function resolveSessionEmployeeId(
  companyId: string,
  userId: string
): Promise<string | null> {
  const { prisma } = await getTenantPrisma();
  const linked = await prisma.employee.findFirst({
    where: { companyId, userId },
    select: { id: true },
  });
  return linked?.id ?? null;
}

export async function listPayrollRecords(filters?: {
  search?: string;
  status?: string;
  month?: string;
  year?: number;
  departmentId?: string;
  employeeId?: string;
  page?: number;
  pageSize?: number;
}): Promise<PayrollListResult> {
  const { companyId, user } = await getTenantPrisma();

  const scopedFilters = { ...(filters ?? {}) };
  const page = clampPage(filters?.page);
  const pageSize = clampPageSize(filters?.pageSize);

  if (!hasOrgPayrollAccess(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId) {
      return { items: [], total: 0, page, pageSize };
    }
    scopedFilters.employeeId = ownId;
  }

  const { items, total } = await payrollRepo.findPayrollsByCompany(
    companyId,
    {
      search: scopedFilters.search,
      status: scopedFilters.status,
      month: scopedFilters.month,
      year: scopedFilters.year,
      departmentId: scopedFilters.departmentId,
      employeeId: scopedFilters.employeeId,
    },
    { page, pageSize }
  );

  return {
    items: items.map(mapPayrollToFrontend),
    total,
    page,
    pageSize,
  };
}

export async function getPayrollRecord(id: string): Promise<PayrollRecord> {
  const { companyId, user } = await getTenantPrisma();
  const row = await payrollRepo.findPayrollById(companyId, id);
  if (!row) {
    throw new AppError("NOT_FOUND", "Payroll record not found.", 404);
  }

  if (!hasOrgPayrollAccess(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId || row.employeeId !== ownId) {
      throw new AppError("NOT_FOUND", "Payroll record not found.", 404);
    }
  }

  return mapPayrollToFrontend(row);
}

export async function getPayrollDashboardStats(): Promise<{
  summary: PayrollSummary;
  stats: PayrollStats;
}> {
  const { companyId, user } = await getTenantPrisma();

  if (!hasOrgPayrollAccess(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId) {
      return {
        summary: {
          totalPayrollRecords: 0,
          totalEmployees: 0,
          paidPayroll: 0,
          pendingPayroll: 0,
          approvedPayroll: 0,
          draftPayroll: 0,
        },
        stats: {
          employeeCount: 0,
          totalGrossSalary: 0,
          totalNetSalary: 0,
          totalAllowances: 0,
          totalDeductions: 0,
          averageNetSalary: 0,
        },
      };
    }
    // Self-scope stats: load all own rows (bounded by one employee), not list page.
    const counted = await payrollRepo.findPayrollsByCompany(
      companyId,
      { employeeId: ownId },
      { page: 1, pageSize: 1 }
    );
    const take = Math.min(Math.max(counted.total, 1), SELF_STATS_MAX_ROWS);
    const { items: rows } = await payrollRepo.findPayrollsByCompany(
      companyId,
      { employeeId: ownId },
      { page: 1, pageSize: take }
    );
    const byStatus: Record<string, number> = {};
    let totalGross = 0;
    let totalNet = 0;
    let totalAll = 0;
    let totalDed = 0;
    let activeCount = 0;
    for (const r of rows) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      if (r.status === "CANCELLED") continue;
      activeCount += 1;
      totalGross += r.grossSalary;
      totalNet += r.netSalary;
      totalAll += r.totalAllowances;
      totalDed += r.totalDeductions;
    }
    return {
      summary: {
        totalPayrollRecords: activeCount,
        totalEmployees: activeCount > 0 ? 1 : 0,
        paidPayroll: byStatus.PAID ?? 0,
        pendingPayroll: byStatus.PENDING ?? 0,
        approvedPayroll: byStatus.APPROVED ?? 0,
        draftPayroll: byStatus.DRAFT ?? 0,
      },
      stats: {
        employeeCount: activeCount,
        totalGrossSalary: totalGross,
        totalNetSalary: totalNet,
        totalAllowances: totalAll,
        totalDeductions: totalDed,
        averageNetSalary:
          activeCount > 0
            ? Math.round((totalNet / activeCount) * 100) / 100
            : 0,
      },
    };
  }

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
  if (employee.status !== "ACTIVE") {
    throw new AppError(
      "VALIDATION",
      "Payroll can only be created for active employees."
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

  let status = (parsed.status ?? "DRAFT") as PayrollStatus;
  if (status === "APPROVED" || status === "PAID") {
    if (!canApprovePayroll(user)) {
      throw new AppError(
        "FORBIDDEN",
        "You do not have permission to create payroll in an approved or paid status.",
        403
      );
    }
  }
  if ((status === "APPROVED" || status === "PAID") && !canApprovePayroll(user)) {
    status = "DRAFT";
  }

  const bounds = payPeriodBounds(parsed.month, parsed.year);
  const start = parseDateOnly(bounds.startIso);
  const end = parseDateOnly(bounds.endIso);

  const basic = parsed.basicSalary;
  const salary = resolveSalaryComponents(basic);

  const attendanceSummary = parsed.attendanceSummary ?? defaultAttendance();
  const leaveSummary = parsed.leaveSummary ?? defaultLeave();

  const employeeName = `${employee.firstName} ${employee.lastName}`.trim();
  const departmentName = employee.department?.departmentName ?? null;
  const payrollNumber = generatePayrollNumber(
    parsed.year,
    parsed.month,
    employee.employeeCode
  );

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
      payPeriodStart: bounds.startIso,
      payPeriodEnd: bounds.endIso,
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

  if (
    nextStatus === "APPROVED" &&
    existing.status !== "APPROVED" &&
    !canApprovePayroll(user)
  ) {
    throw new AppError(
      "FORBIDDEN",
      "You do not have permission to approve payroll.",
      403
    );
  }
  if (
    nextStatus === "PAID" &&
    existing.status !== "PAID" &&
    !canApprovePayroll(user)
  ) {
    throw new AppError(
      "FORBIDDEN",
      "You do not have permission to mark payroll as paid.",
      403
    );
  }

  const basic = parsed.basicSalary ?? existing.basicSalary;
  const salary = resolveSalaryComponents(basic);

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

  if (parsed.payPeriodStart !== undefined || parsed.payPeriodEnd !== undefined) {
    const bounds = payPeriodBounds(existing.month, existing.year);
    data.payPeriodStart = parseDateOnly(bounds.startIso);
    data.payPeriodEnd = parseDateOnly(bounds.endIso);
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
