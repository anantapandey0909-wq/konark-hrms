/**
 * Reports repository — read-only tenant-scoped aggregations over existing tables.
 * companyId must come from the authenticated session (never from the client).
 *
 * Payroll financial metrics exclude CANCELLED records so voided/QA cancels
 * do not inflate cost, average compensation, department allocation, or trends.
 */

import { PayrollStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

/** Tenant-scoped payroll filter that omits cancelled (void) records. */
function nonCancelledPayrollWhere(companyId: string) {
  return tenantScope(companyId, {
    status: { not: PayrollStatus.CANCELLED },
  });
}

export async function groupEmployeesByStatus(companyId: string) {
  return prisma.employee.groupBy({
    by: ["status"],
    where: tenantScope(companyId, {}),
    _count: { _all: true },
  });
}

export async function groupEmployeesByEmploymentType(companyId: string) {
  return prisma.employee.groupBy({
    by: ["employmentType"],
    where: tenantScope(companyId, {}),
    _count: { _all: true },
  });
}

export async function groupEmployeesByDepartment(companyId: string) {
  return prisma.employee.groupBy({
    by: ["departmentId"],
    where: tenantScope(companyId, {}),
    _count: { _all: true },
  });
}

export async function countEmployees(companyId: string) {
  return prisma.employee.count({
    where: tenantScope(companyId, {}),
  });
}

export async function findRecentHires(companyId: string, limit = 5) {
  return prisma.employee.findMany({
    where: tenantScope(companyId, {}),
    orderBy: { joiningDate: "desc" },
    take: limit,
    select: {
      id: true,
      employeeCode: true,
      firstName: true,
      lastName: true,
      designation: true,
      joiningDate: true,
    },
  });
}

export async function listDepartmentsForCompany(companyId: string) {
  return prisma.department.findMany({
    where: tenantScope(companyId, {}),
    select: { id: true, departmentName: true },
  });
}

export async function groupAttendanceByStatus(companyId: string) {
  return prisma.attendance.groupBy({
    by: ["status"],
    where: tenantScope(companyId, {}),
    _count: { _all: true },
  });
}

export async function aggregateAttendanceHours(companyId: string) {
  return prisma.attendance.aggregate({
    where: tenantScope(companyId, {}),
    _sum: { totalHours: true, overtimeHours: true },
    _avg: { totalHours: true },
    _count: { _all: true },
  });
}

export async function countRegularizedAttendance(companyId: string) {
  return prisma.attendance.count({
    where: tenantScope(companyId, { isRegularized: true }),
  });
}

export async function groupLeaveByStatus(companyId: string) {
  return prisma.leaveRequest.groupBy({
    by: ["status"],
    where: tenantScope(companyId, {}),
    _count: { _all: true },
  });
}

export async function groupPayrollByStatus(companyId: string) {
  return prisma.payroll.groupBy({
    by: ["status"],
    where: tenantScope(companyId, {}),
    _count: { _all: true },
  });
}

export async function aggregatePayrollAmounts(companyId: string) {
  return prisma.payroll.aggregate({
    where: nonCancelledPayrollWhere(companyId),
    _sum: {
      grossSalary: true,
      netSalary: true,
      totalAllowances: true,
      totalDeductions: true,
    },
    _avg: { netSalary: true },
    _count: { _all: true },
  });
}

export async function sumNetSalaryByPayrollStatus(companyId: string) {
  return prisma.payroll.groupBy({
    by: ["status"],
    where: nonCancelledPayrollWhere(companyId),
    _sum: { netSalary: true },
    _count: { _all: true },
  });
}

/**
 * Distinct employees with at least one non-CANCELLED payroll row.
 * groupBy employeeId avoids transferring every payroll row; result size = unique employees.
 */
export async function distinctPayrollEmployeeCount(companyId: string) {
  const groups = await prisma.payroll.groupBy({
    by: ["employeeId"],
    where: nonCancelledPayrollWhere(companyId),
  });
  return groups.length;
}

/**
 * All-time monthly payroll trend aggregates (non-CANCELLED only).
 * Replaces full-row listPayrollForTrends for month/year charts.
 */
export async function groupPayrollTrendByMonthYear(companyId: string) {
  return prisma.payroll.groupBy({
    by: ["year", "month"],
    where: nonCancelledPayrollWhere(companyId),
    _sum: {
      grossSalary: true,
      netSalary: true,
    },
    _count: { _all: true },
  });
}

/**
 * All-time department allocation using denormalized Payroll.departmentName
 * (same label source used when present on payroll rows).
 * Non-CANCELLED only. Null/empty names map to Unassigned in the service.
 */
export async function groupPayrollByDepartmentName(companyId: string) {
  return prisma.payroll.groupBy({
    by: ["departmentName"],
    where: nonCancelledPayrollWhere(companyId),
    _sum: {
      grossSalary: true,
      netSalary: true,
    },
    _count: { _all: true },
  });
}
