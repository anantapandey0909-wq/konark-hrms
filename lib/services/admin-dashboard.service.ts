/**
 * Admin dashboard service — read-only KPIs for /dashboard (ADMIN landing).
 * Reuses Reports aggregations where possible; adds present-today and weekly series.
 * Tenant identity always from getTenantPrisma() session context.
 */

import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { getPermissions } from "@/lib/auth/permissions";
import type { AuthUser } from "@/types/auth";
import * as reportsRepo from "@/lib/repositories/reports.repository";
import * as adminRepo from "@/lib/repositories/admin-dashboard.repository";

export type WeeklyAttendancePoint = {
  day: string;
  present: number;
};

export type AdminRecentHire = {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  departmentName: string;
  status: string;
  joiningDate: string;
};

export type AdminPayrollStatusCounts = {
  draft: number;
  pending: number;
  approved: number;
  paid: number;
  cancelled: number;
};

export type AdminDashboardData = {
  totalEmployees: number;
  pendingLeaveRequests: number;
  presentTodayPercent: number;
  presentTodayCount: number;
  activeEmployeeCount: number;
  weeklyAttendance: WeeklyAttendancePoint[];
  recentHires: AdminRecentHire[];
  /** Null when actor lacks payroll permission — no salary figures ever. */
  payrollStatusCounts: AdminPayrollStatusCounts | null;
  includePayrollMetrics: boolean;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Statuses treated as "present for work" for rate/chart (existing enum semantics). */
function isPresentStatus(status: string): boolean {
  return status === "PRESENT" || status === "LATE" || status === "HALF_DAY";
}

function canViewPayrollMetrics(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  const p = getPermissions(user.role);
  return (
    p.payroll.view ||
    p.payroll.generate ||
    p.payroll.approve ||
    p.payroll.upload
  );
}

/** Calendar day bounds in UTC for @db.Date comparisons. */
function utcDayBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

/** Monday 00:00 UTC of the week containing `ref` through next Monday. */
function utcWeekBounds(ref: Date): { start: Date; end: Date } {
  const day = ref.getUTCDay(); // 0 Sun .. 6 Sat
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate())
  );
  monday.setUTCDate(monday.getUTCDate() + mondayOffset);
  const nextMonday = new Date(monday);
  nextMonday.setUTCDate(nextMonday.getUTCDate() + 7);
  return { start: monday, end: nextMonday };
}

function formatJoiningRelative(joiningDate: Date): string {
  return joiningDate.toISOString().slice(0, 10);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const { companyId, user } = await getTenantPrisma();
  const includePayroll = canViewPayrollMetrics(user);
  const now = new Date();
  const { start: todayStart, end: todayEnd } = utcDayBounds(now);
  const { start: weekStart, end: weekEnd } = utcWeekBounds(now);

  const [
    totalEmployees,
    leaveStatusGroups,
    activeEmployeeCount,
    todayStatusGroups,
    weekRows,
    recentHireRows,
    payrollStatusGroups,
  ] = await Promise.all([
    reportsRepo.countEmployees(companyId),
    reportsRepo.groupLeaveByStatus(companyId),
    adminRepo.countActiveEmployees(companyId),
    adminRepo.groupAttendanceByStatusForDate(companyId, todayStart, todayEnd),
    adminRepo.listAttendanceStatusesInRange(companyId, weekStart, weekEnd),
    prismaRecentHires(companyId),
    includePayroll
      ? adminRepo.countPayrollByStatus(companyId)
      : Promise.resolve(null),
  ]);

  let pendingLeaveRequests = 0;
  for (const g of leaveStatusGroups) {
    if (g.status === "PENDING") {
      pendingLeaveRequests = g._count._all;
    }
  }

  let presentTodayCount = 0;
  for (const g of todayStatusGroups) {
    if (isPresentStatus(g.status)) {
      presentTodayCount += g._count._all;
    }
  }

  const presentTodayPercent =
    activeEmployeeCount > 0
      ? Math.round((presentTodayCount / activeEmployeeCount) * 1000) / 10
      : 0;

  // Build Mon–Sun series for the current week (zeros when no rows).
  const presentByUtcDay = new Map<string, number>();
  for (const row of weekRows) {
    if (!isPresentStatus(row.status)) continue;
    const key = row.attendanceDate.toISOString().slice(0, 10);
    presentByUtcDay.set(key, (presentByUtcDay.get(key) ?? 0) + 1);
  }

  const weeklyAttendance: WeeklyAttendancePoint[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setUTCDate(weekStart.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const label = WEEKDAY_LABELS[d.getUTCDay()];
    weeklyAttendance.push({
      day: label,
      present: presentByUtcDay.get(key) ?? 0,
    });
  }

  const recentHires: AdminRecentHire[] = recentHireRows.map((emp) => ({
    id: emp.id,
    employeeCode: emp.employeeCode,
    name: `${emp.firstName} ${emp.lastName}`.trim(),
    designation: emp.designation,
    departmentName: emp.department?.departmentName ?? "—",
    status: emp.status,
    joiningDate: formatJoiningRelative(emp.joiningDate),
  }));

  let payrollStatusCounts: AdminPayrollStatusCounts | null = null;
  if (includePayroll && payrollStatusGroups) {
    payrollStatusCounts = {
      draft: 0,
      pending: 0,
      approved: 0,
      paid: 0,
      cancelled: 0,
    };
    for (const g of payrollStatusGroups) {
      const n = g._count._all;
      switch (g.status) {
        case "DRAFT":
          payrollStatusCounts.draft = n;
          break;
        case "PENDING":
          payrollStatusCounts.pending = n;
          break;
        case "APPROVED":
          payrollStatusCounts.approved = n;
          break;
        case "PAID":
          payrollStatusCounts.paid = n;
          break;
        case "CANCELLED":
          payrollStatusCounts.cancelled = n;
          break;
      }
    }
  }

  return {
    totalEmployees,
    pendingLeaveRequests,
    presentTodayPercent,
    presentTodayCount,
    activeEmployeeCount,
    weeklyAttendance,
    recentHires,
    payrollStatusCounts,
    includePayrollMetrics: includePayroll,
  };
}

async function prismaRecentHires(companyId: string) {
  const { prisma } = await import("@/lib/prisma");
  const { tenantScope } = await import("@/lib/db/prisma-with-tenant");
  return prisma.employee.findMany({
    where: tenantScope(companyId, {}),
    orderBy: { joiningDate: "desc" },
    take: 5,
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
