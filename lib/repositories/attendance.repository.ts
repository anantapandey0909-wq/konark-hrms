/**
 * Attendance repository — database access only.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";

const attendanceInclude = {
  employee: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      designation: true,
      departmentId: true,
    },
  },
} as const;

export type AttendanceListFilters = {
  startDate?: string;
  endDate?: string;
  status?: string;
  workMode?: string;
  employeeId?: string;
  departmentId?: string;
};

export type AttendanceListPagination = {
  /** 1-based page (already clamped by service). */
  page: number;
  pageSize: number;
};

/** Optional self-scope for metrics (non-org viewers). companyId from session only. */
export type AttendanceMetricsScope = {
  employeeId?: string;
};

function dayStart(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildAttendanceWhere(
  companyId: string,
  filters: AttendanceListFilters
): Prisma.AttendanceWhereInput {
  const where: Prisma.AttendanceWhereInput = tenantScope(companyId, {});

  if (filters.employeeId) {
    where.employeeId = filters.employeeId;
  }
  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumAttendanceStatusFilter["equals"];
  }
  if (filters.workMode && filters.workMode !== "ALL") {
    where.workMode = filters.workMode as Prisma.EnumWorkModeFilter["equals"];
  }
  if (filters.startDate || filters.endDate) {
    where.attendanceDate = {};
    if (filters.startDate) {
      where.attendanceDate.gte = dayStart(filters.startDate);
    }
    if (filters.endDate) {
      where.attendanceDate.lte = dayStart(filters.endDate);
    }
  }
  if (filters.departmentId) {
    where.employee = { departmentId: filters.departmentId };
  }

  return where;
}

const attendanceOrderBy: Prisma.AttendanceOrderByWithRelationInput[] = [
  { attendanceDate: "desc" },
  { createdAt: "desc" },
  { id: "desc" },
];

/**
 * Paginated tenant attendance list.
 * Same WHERE for findMany + count. Offset pagination only.
 */
export async function findAttendancesByCompany(
  companyId: string,
  filters: AttendanceListFilters = {},
  pagination: AttendanceListPagination = { page: 1, pageSize: 10 }
) {
  const where = buildAttendanceWhere(companyId, filters);
  const skip = (pagination.page - 1) * pagination.pageSize;
  const take = pagination.pageSize;

  const [items, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: attendanceInclude,
      orderBy: attendanceOrderBy,
      skip,
      take,
    }),
    prisma.attendance.count({ where }),
  ]);

  return { items, total };
}

/**
 * All-time Attendance KPIs via DB aggregation — does not load Attendance rows.
 * Semantics match calculateAttendanceMetrics() in lib/reports/attendance-metrics.ts.
 * No date window. Independent of list pagination.
 */
export async function getAttendanceMetricsByCompany(
  companyId: string,
  scope: AttendanceMetricsScope = {}
): Promise<AttendanceMetrics> {
  const baseWhere: Prisma.AttendanceWhereInput = tenantScope(companyId, {});
  if (scope.employeeId) {
    baseWhere.employeeId = scope.employeeId;
  }

  const [
    totalRecords,
    grouped,
    hoursAgg,
    overtimeAgg,
    regularizationCount,
  ] = await Promise.all([
    prisma.attendance.count({ where: baseWhere }),
    prisma.attendance.groupBy({
      by: ["status"],
      where: baseWhere,
      _count: { _all: true },
    }),
    prisma.attendance.aggregate({
      where: { ...baseWhere, totalHours: { not: null } },
      _sum: { totalHours: true },
      _count: { _all: true },
    }),
    prisma.attendance.aggregate({
      where: { ...baseWhere, overtimeHours: { not: null } },
      _sum: { overtimeHours: true },
    }),
    prisma.attendance.count({
      where: { ...baseWhere, isRegularized: true },
    }),
  ]);

  const byStatus: Record<string, number> = {};
  for (const row of grouped) {
    byStatus[row.status] = row._count._all;
  }

  const presentCount = byStatus.PRESENT ?? 0;
  const lateCount = byStatus.LATE ?? 0;
  const halfDayCount = byStatus.HALF_DAY ?? 0;
  const absentCount = byStatus.ABSENT ?? 0;
  const onLeaveCount = byStatus.ON_LEAVE ?? 0;

  const activeWorkDaysCount = hoursAgg._count._all;
  const totalWorkingHours = hoursAgg._sum.totalHours ?? 0;
  const averageWorkingHours =
    activeWorkDaysCount > 0
      ? roundToTwoDecimals(totalWorkingHours / activeWorkDaysCount)
      : 0;

  const totalOvertimeHours = roundToTwoDecimals(
    overtimeAgg._sum.overtimeHours ?? 0
  );

  return {
    totalRecords,
    presentCount,
    lateCount,
    halfDayCount,
    absentCount,
    onLeaveCount,
    averageWorkingHours,
    totalOvertimeHours,
    regularizationCount,
  };
}

export async function findAttendanceById(companyId: string, id: string) {
  return prisma.attendance.findFirst({
    where: tenantScope(companyId, { id }),
    include: attendanceInclude,
  });
}

export async function findAttendanceByEmployeeDate(
  companyId: string,
  employeeId: string,
  attendanceDate: Date
) {
  return prisma.attendance.findFirst({
    where: tenantScope(companyId, {
      employeeId,
      attendanceDate,
    }),
    include: attendanceInclude,
  });
}

/**
 * Batch lookup for import conflict detection (avoids N+1).
 * companyId is trusted server context only.
 */
export async function findAttendancesByEmployeeDates(
  companyId: string,
  employeeIds: string[],
  attendanceDates: Date[]
) {
  if (employeeIds.length === 0 || attendanceDates.length === 0) return [];

  const uniqueEmployees = Array.from(new Set(employeeIds.filter(Boolean)));
  const uniqueDates = Array.from(
    new Map(
      attendanceDates.map((d) => [d.toISOString().slice(0, 10), d])
    ).values()
  );

  if (uniqueEmployees.length === 0 || uniqueDates.length === 0) return [];

  const where: Prisma.AttendanceWhereInput = {
    companyId,
    employeeId: { in: uniqueEmployees },
    attendanceDate: { in: uniqueDates },
  };

  return prisma.attendance.findMany({
    where,
    select: {
      id: true,
      employeeId: true,
      attendanceDate: true,
    },
  });
}

export async function createAttendance(data: Prisma.AttendanceCreateInput) {
  return prisma.attendance.create({
    data,
    include: attendanceInclude,
  });
}

export async function updateAttendance(
  companyId: string,
  id: string,
  data: Prisma.AttendanceUpdateInput
) {
  const existing = await findAttendanceById(companyId, id);
  if (!existing) return null;

  return prisma.attendance.update({
    where: { id },
    data,
    include: attendanceInclude,
  });
}
