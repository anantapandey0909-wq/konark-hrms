/**
 * Admin dashboard repository — read-only tenant-scoped queries.
 * companyId must come from the authenticated session (never from the client).
 */

import { EmployeeStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

/** Active headcount for present-rate denominator. */
export async function countActiveEmployees(companyId: string): Promise<number> {
  return prisma.employee.count({
    where: tenantScope(companyId, { status: EmployeeStatus.ACTIVE }),
  });
}

/**
 * Attendance status counts for a single calendar day.
 * Bounds are [dayStart, dayEnd) against attendanceDate (@db.Date).
 */
export async function groupAttendanceByStatusForDate(
  companyId: string,
  dayStart: Date,
  dayEnd: Date
) {
  return prisma.attendance.groupBy({
    by: ["status"],
    where: tenantScope(companyId, {
      attendanceDate: {
        gte: dayStart,
        lt: dayEnd,
      },
    }),
    _count: { _all: true },
  });
}

/**
 * Attendance rows in a date range with status only (for weekly present aggregation).
 */
export async function listAttendanceStatusesInRange(
  companyId: string,
  rangeStart: Date,
  rangeEnd: Date
) {
  return prisma.attendance.findMany({
    where: tenantScope(companyId, {
      attendanceDate: {
        gte: rangeStart,
        lt: rangeEnd,
      },
    }),
    select: {
      attendanceDate: true,
      status: true,
    },
  });
}

/** Payroll status counts only — no salary amounts. */
export async function countPayrollByStatus(companyId: string) {
  return prisma.payroll.groupBy({
    by: ["status"],
    where: tenantScope(companyId, {}),
    _count: { _all: true },
  });
}

/** Recent hires with department name for the admin dashboard table. */
export async function findRecentHiresWithDepartment(
  companyId: string,
  limit = 5
) {
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
      status: true,
      joiningDate: true,
      department: { select: { departmentName: true } },
    },
  });
}
