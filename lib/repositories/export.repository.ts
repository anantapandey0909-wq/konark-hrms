/**
 * Export repository — database access only.
 * All queries require trusted companyId from server session.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";
import type { ExportFilters } from "@/lib/validation/export";
import { MAX_EXPORT_ROWS } from "@/lib/validation/export";

function dayStart(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

export async function countEmployees(
  companyId: string,
  filters: ExportFilters = {}
) {
  const where: Prisma.EmployeeWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumEmployeeStatusFilter["equals"];
  }
  if (filters?.departmentId && filters.departmentId !== "ALL") {
    where.departmentId = filters.departmentId;
  }
  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { employeeCode: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  return prisma.employee.count({ where });
}

export async function fetchEmployeesForExport(
  companyId: string,
  filters: ExportFilters = {},
  take = MAX_EXPORT_ROWS
) {
  const where: Prisma.EmployeeWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumEmployeeStatusFilter["equals"];
  }
  if (filters?.departmentId && filters.departmentId !== "ALL") {
    where.departmentId = filters.departmentId;
  }
  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { employeeCode: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  return prisma.employee.findMany({
    where,
    include: { department: true },
    orderBy: [{ employeeCode: "asc" }],
    take,
  });
}

export async function countDepartments(
  companyId: string,
  filters: ExportFilters = {}
) {
  const where: Prisma.DepartmentWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumDepartmentStatusFilter["equals"];
  }
  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { departmentCode: { contains: q, mode: "insensitive" } },
      { departmentName: { contains: q, mode: "insensitive" } },
    ];
  }
  return prisma.department.count({ where });
}

export async function fetchDepartmentsForExport(
  companyId: string,
  filters: ExportFilters = {},
  take = MAX_EXPORT_ROWS
) {
  const where: Prisma.DepartmentWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumDepartmentStatusFilter["equals"];
  }
  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { departmentCode: { contains: q, mode: "insensitive" } },
      { departmentName: { contains: q, mode: "insensitive" } },
    ];
  }
  return prisma.department.findMany({
    where,
    orderBy: [{ departmentCode: "asc" }],
    take,
  });
}

export async function countAttendance(
  companyId: string,
  filters: ExportFilters = {}
) {
  const where: Prisma.AttendanceWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumAttendanceStatusFilter["equals"];
  }
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.startDate || filters?.endDate) {
    where.attendanceDate = {};
    if (filters.startDate) where.attendanceDate.gte = dayStart(filters.startDate);
    if (filters.endDate) where.attendanceDate.lte = dayStart(filters.endDate);
  }
  return prisma.attendance.count({ where });
}

export async function fetchAttendanceForExport(
  companyId: string,
  filters: ExportFilters = {},
  take = MAX_EXPORT_ROWS
) {
  const where: Prisma.AttendanceWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumAttendanceStatusFilter["equals"];
  }
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.startDate || filters?.endDate) {
    where.attendanceDate = {};
    if (filters.startDate) where.attendanceDate.gte = dayStart(filters.startDate);
    if (filters.endDate) where.attendanceDate.lte = dayStart(filters.endDate);
  }
  return prisma.attendance.findMany({
    where,
    include: {
      employee: {
        select: {
          employeeCode: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [{ attendanceDate: "desc" }],
    take,
  });
}

export async function countLeave(
  companyId: string,
  filters: ExportFilters = {}
) {
  const where: Prisma.LeaveRequestWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumLeaveStatusFilter["equals"];
  }
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.startDate || filters?.endDate) {
    where.startDate = {};
    if (filters.startDate) where.startDate.gte = dayStart(filters.startDate);
    if (filters.endDate) where.startDate.lte = dayStart(filters.endDate);
  }
  return prisma.leaveRequest.count({ where });
}

export async function fetchLeaveForExport(
  companyId: string,
  filters: ExportFilters = {},
  take = MAX_EXPORT_ROWS
) {
  const where: Prisma.LeaveRequestWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumLeaveStatusFilter["equals"];
  }
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.startDate || filters?.endDate) {
    where.startDate = {};
    if (filters.startDate) where.startDate.gte = dayStart(filters.startDate);
    if (filters.endDate) where.startDate.lte = dayStart(filters.endDate);
  }
  return prisma.leaveRequest.findMany({
    where,
    include: {
      employee: {
        select: {
          employeeCode: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [{ startDate: "desc" }],
    take,
  });
}

export async function countPayroll(
  companyId: string,
  filters: ExportFilters = {}
) {
  const where: Prisma.PayrollWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumPayrollStatusFilter["equals"];
  }
  if (filters?.month && filters.month !== "ALL") {
    where.month = filters.month as Prisma.EnumPayrollMonthFilter["equals"];
  }
  if (typeof filters?.year === "number") where.year = filters.year;
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  return prisma.payroll.count({ where });
}

export async function fetchPayrollForExport(
  companyId: string,
  filters: ExportFilters = {},
  take = MAX_EXPORT_ROWS
) {
  const where: Prisma.PayrollWhereInput = tenantScope(companyId, {});
  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumPayrollStatusFilter["equals"];
  }
  if (filters?.month && filters.month !== "ALL") {
    where.month = filters.month as Prisma.EnumPayrollMonthFilter["equals"];
  }
  if (typeof filters?.year === "number") where.year = filters.year;
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  return prisma.payroll.findMany({
    where,
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take,
  });
}

/** Lightweight report snapshot (counts only — not a full BI dump). */
export async function fetchReportSnapshot(companyId: string) {
  const [employees, departments, attendance, leave, payroll] =
    await Promise.all([
      prisma.employee.count({ where: { companyId } }),
      prisma.department.count({ where: { companyId } }),
      prisma.attendance.count({ where: { companyId } }),
      prisma.leaveRequest.count({ where: { companyId } }),
      prisma.payroll.count({ where: { companyId } }),
    ]);
  return [
    { metric: "Employees", value: employees },
    { metric: "Departments", value: departments },
    { metric: "Attendance records", value: attendance },
    { metric: "Leave requests", value: leave },
    { metric: "Payroll records", value: payroll },
  ];
}

export async function findExportAuditHistory(companyId: string, take = 25) {
  return prisma.auditLog.findMany({
    where: {
      companyId,
      action: "DATA_EXPORTED",
      entity: "Export",
    },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      actor: {
        select: {
          email: true,
          userCode: true,
        },
      },
    },
  });
}

export async function findRecentExportAudits(companyId: string, take = 100) {
  return prisma.auditLog.findMany({
    where: {
      companyId,
      action: "DATA_EXPORTED",
      entity: "Export",
    },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      createdAt: true,
      metadata: true,
    },
  });
}
