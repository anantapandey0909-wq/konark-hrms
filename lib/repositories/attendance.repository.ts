/**
 * Attendance repository — database access only.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

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

function dayStart(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

export async function findAttendancesByCompany(
  companyId: string,
  filters: AttendanceListFilters = {}
) {
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

  return prisma.attendance.findMany({
    where,
    include: attendanceInclude,
    orderBy: [{ attendanceDate: "desc" }, { createdAt: "desc" }],
  });
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
