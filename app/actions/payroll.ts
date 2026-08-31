"use server";

import { revalidatePath } from "next/cache";
import {
  assertProductionRealData,
  requirePayrollGenerate,
  requirePayrollView,
} from "@/lib/auth/assert-data-management";
import { getPermissions } from "@/lib/auth/permissions";
import { isRealDataEnabled } from "@/lib/config/flags";
import { mockPayrollRecords } from "@/mock/payroll";
import {
  listPayrollRecords,
  getPayrollRecord,
  getPayrollDashboardStats,
  createPayrollRecord,
  updatePayrollRecord,
} from "@/lib/services/payroll.service";
import type {
  CreatePayrollInput,
  UpdatePayrollInput,
} from "@/lib/validation/payroll";
import { toSafeActionResult } from "@/lib/errors/app-error";
import type { AuthUser } from "@/types/auth";
import type {
  PayrollRecord,
  PayrollSummary,
  PayrollStats,
} from "@/types/payroll";
import {
  calculatePayrollSummary,
  calculatePayrollStatistics,
} from "@/lib/payroll";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

/** Same organizational access rule as lib/services/payroll.service.ts */
function hasOrgPayrollAccess(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  const p = getPermissions(user.role);
  return p.payroll.generate || p.payroll.approve || p.payroll.upload;
}

function filterMock(
  filters?: {
    search?: string;
    status?: string;
    month?: string;
    year?: number;
    departmentId?: string;
    employeeId?: string;
  }
): PayrollRecord[] {
  return mockPayrollRecords.filter((r) => {
    if (filters?.status && filters.status !== "ALL" && r.status !== filters.status)
      return false;
    if (filters?.month && filters.month !== "ALL" && r.month !== filters.month)
      return false;
    if (typeof filters?.year === "number" && r.year !== filters.year) return false;
    if (filters?.employeeId && r.employeeId !== filters.employeeId) return false;
    if (
      filters?.departmentId &&
      filters.departmentId !== "ALL" &&
      r.department.id !== filters.departmentId
    )
      return false;
    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      const hay =
        `${r.employeeName} ${r.employeeCode} ${r.payrollNumber}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** Apply org-access or self-scope to mock payroll rows (parity with real service). */
function mockPayrollForUser(
  user: AuthUser,
  filters?: {
    search?: string;
    status?: string;
    month?: string;
    year?: number;
    departmentId?: string;
    employeeId?: string;
  }
): PayrollRecord[] {
  const scopedFilters = { ...(filters ?? {}) };

  if (!hasOrgPayrollAccess(user)) {
    // AuthUser.employeeId is the employee code from map-user; also match record id.
    const identity = user.employeeId;
    scopedFilters.employeeId = undefined;
    return filterMock(scopedFilters).filter(
      (r) => r.employeeCode === identity || r.employeeId === identity
    );
  }

  return filterMock(scopedFilters);
}

export async function listPayrollRecordsAction(filters?: {
  search?: string;
  status?: string;
  month?: string;
  year?: number;
  departmentId?: string;
  employeeId?: string;
}): Promise<ActionResult<PayrollRecord[]>> {
  let user: AuthUser;
  try {
    user = await requirePayrollView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return { success: true, data: mockPayrollForUser(user, filters) };
  }
  try {
    return { success: true, data: await listPayrollRecords(filters) };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getPayrollRecordAction(
  id: string
): Promise<ActionResult<PayrollRecord>> {
  let user: AuthUser;
  try {
    user = await requirePayrollView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const row = mockPayrollRecords.find((r) => r.id === id);
    if (!row) {
      return {
        success: false,
        error: "Payroll record not found.",
        code: "NOT_FOUND",
      };
    }
    if (!hasOrgPayrollAccess(user)) {
      const identity = user.employeeId;
      if (row.employeeCode !== identity && row.employeeId !== identity) {
        return {
          success: false,
          error: "Payroll record not found.",
          code: "NOT_FOUND",
        };
      }
    }
    return { success: true, data: row };
  }
  try {
    return { success: true, data: await getPayrollRecord(id) };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getPayrollStatsAction(): Promise<
  ActionResult<{ summary: PayrollSummary; stats: PayrollStats }>
> {
  let user: AuthUser;
  try {
    user = await requirePayrollView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const rows = mockPayrollForUser(user);
    const statsLib = calculatePayrollStatistics(rows);
    const summaryLib = calculatePayrollSummary(rows);
    return {
      success: true,
      data: {
        summary: {
          totalPayrollRecords: statsLib.totalRecordsCount,
          totalEmployees: hasOrgPayrollAccess(user)
            ? statsLib.totalRecordsCount
            : rows.length > 0
              ? 1
              : 0,
          paidPayroll: statsLib.paidCount,
          pendingPayroll: statsLib.pendingCount,
          approvedPayroll: statsLib.approvedCount,
          draftPayroll: statsLib.draftCount,
        },
        stats: {
          employeeCount: hasOrgPayrollAccess(user)
            ? statsLib.totalRecordsCount
            : rows.length > 0
              ? 1
              : 0,
          totalGrossSalary:
            summaryLib.totalBasicSalary + summaryLib.totalAllowances,
          totalNetSalary: summaryLib.totalNetSalary,
          totalAllowances: summaryLib.totalAllowances,
          totalDeductions: summaryLib.totalDeductions,
          averageNetSalary: statsLib.averageNetSalary,
        },
      },
    };
  }
  try {
    return { success: true, data: await getPayrollDashboardStats() };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function createPayrollAction(
  input: CreatePayrollInput
): Promise<ActionResult<PayrollRecord>> {
  try {
    await requirePayrollGenerate();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const id = `pay-mock-${Date.now()}`;
    const mock = filterMock({})[0];
    return {
      success: true,
      data: {
        ...(mock ?? {
          id,
          payrollNumber: `PAY-MOCK-${Date.now()}`,
          employeeId: input.employeeId,
          employeeCode: "MOCK",
          employeeName: "Mock Employee",
          department: {
            id: "dept-mock",
            tenantId: "tenant-mock",
            name: "Mock",
            code: "MOCK",
            description: null,
            managerId: null,
            parentDepartmentId: null,
            status: "ACTIVE" as const,
            sortOrder: 0,
            budget: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          designation: "Employee",
          month: input.month,
          year: input.year,
          status: input.status ?? "DRAFT",
          payPeriodStart: input.payPeriodStart,
          payPeriodEnd: input.payPeriodEnd,
          attendanceSummary: {
            workingDays: 22,
            presentDays: 20,
            absentDays: 0,
            paidLeaveDays: 2,
            unpaidLeaveDays: 0,
            overtimeHours: 0,
            lateEntries: 0,
          },
          leaveSummary: {
            totalLeaves: 2,
            paidLeaves: 2,
            unpaidLeaves: 0,
            leaveWithoutPayDays: 0,
          },
          salaryBreakdown: {
            basicSalary: input.basicSalary,
            grossSalary: input.basicSalary,
            taxableIncome: input.basicSalary,
            totalAllowances: 0,
            totalDeductions: 0,
            netSalary: input.basicSalary,
            allowances: [],
            deductions: [],
          },
          generatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        id,
        employeeId: input.employeeId,
        month: input.month,
        year: input.year,
        status: input.status ?? "DRAFT",
      },
    };
  }
  try {
    const data = await createPayrollRecord(input);
    revalidatePath("/dashboard/payroll");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function updatePayrollAction(
  id: string,
  input: UpdatePayrollInput
): Promise<ActionResult<PayrollRecord>> {
  try {
    await requirePayrollGenerate();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = mockPayrollRecords.find((r) => r.id === id);
    if (!existing) {
      return {
        success: false,
        error: "Payroll record not found.",
        code: "NOT_FOUND",
      };
    }
    return {
      success: true,
      data: {
        ...existing,
        status: input.status ?? existing.status,
        notes: input.notes ?? existing.notes,
        updatedAt: new Date().toISOString(),
      },
    };
  }
  try {
    const data = await updatePayrollRecord(id, input);
    revalidatePath("/dashboard/payroll");
    revalidatePath(`/dashboard/payroll/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
