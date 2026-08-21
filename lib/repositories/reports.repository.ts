/**
 * Reports repository — read-only tenant-scoped aggregations over existing tables.
 * companyId must come from the authenticated session (never from the client).
 */

import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

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
      workLocation: true,
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
    where: tenantScope(companyId, {}),
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
    where: tenantScope(companyId, {}),
    _sum: { netSalary: true },
    _count: { _all: true },
  });
}

export async function distinctPayrollEmployeeCount(companyId: string) {
  const rows = await prisma.payroll.findMany({
    where: tenantScope(companyId, {}),
    select: { employeeId: true },
    distinct: ["employeeId"],
  });
  return rows.length;
}

export async function listPayrollForTrends(companyId: string) {
  return prisma.payroll.findMany({
    where: tenantScope(companyId, {}),
    select: {
      month: true,
      year: true,
      status: true,
      grossSalary: true,
      netSalary: true,
      totalAllowances: true,
      totalDeductions: true,
      employeeId: true,
      departmentName: true,
      employee: {
        select: { departmentId: true },
      },
    },
  });
}
