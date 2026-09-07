"use server";

import {
  assertProductionRealData,
  requireReportsView,
} from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { getPermissions } from "@/lib/auth/permissions";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  getAdminDashboardData,
  type AdminDashboardData,
  type AdminPayrollStatusCounts,
} from "@/lib/services/admin-dashboard.service";
import { mockEmployees } from "@/mock/employee";
import { mockLeaveRequests } from "@/mock/leave";
import { mockAttendances } from "@/mock/attendance";
import { mockPayrollRecords } from "@/mock/payroll";
import type { AuthUser } from "@/types/auth";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

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

function isPresentStatus(status: string): boolean {
  return status === "PRESENT" || status === "LATE" || status === "HALF_DAY";
}

function incrementMockPayrollStatus(
  counts: AdminPayrollStatusCounts,
  status: string
): void {
  switch (status) {
    case "DRAFT":
      counts.draft += 1;
      break;
    case "PENDING":
      counts.pending += 1;
      break;
    case "APPROVED":
      counts.approved += 1;
      break;
    case "PAID":
      counts.paid += 1;
      break;
    case "CANCELLED":
      counts.cancelled += 1;
      break;
    default:
      break;
  }
}

function buildMockAdminDashboard(user: AuthUser): AdminDashboardData {
  const includePayroll = canViewPayrollMetrics(user);
  const activeEmployees = mockEmployees.filter((e) => e.status === "ACTIVE");
  const today = new Date().toISOString().slice(0, 10);

  const todayRows = mockAttendances.filter((a) => a.attendanceDate === today);
  const presentTodayCount = todayRows.filter((a) =>
    isPresentStatus(a.status)
  ).length;
  const activeEmployeeCount = activeEmployees.length;
  const presentTodayPercent =
    activeEmployeeCount > 0
      ? Math.round((presentTodayCount / activeEmployeeCount) * 1000) / 10
      : 0;

  const pendingLeaveRequests = mockLeaveRequests.filter(
    (l) => l.status === "PENDING"
  ).length;

  const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monFirst = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day) => ({
      day,
      present: mockAttendances.filter(
        (a) =>
          isPresentStatus(a.status) &&
          WEEKDAY_LABELS[
            new Date(a.attendanceDate + "T00:00:00Z").getUTCDay()
          ] === day
      ).length,
    })
  );

  const recentHires = [...mockEmployees]
    .sort(
      (a, b) =>
        new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()
    )
    .slice(0, 5)
    .map((emp) => ({
      id: emp.id,
      employeeCode: emp.employeeId,
      name: `${emp.firstName} ${emp.lastName}`,
      designation: emp.designation,
      departmentName: emp.departmentId ?? "—",
      status: emp.status,
      joiningDate: emp.joiningDate,
    }));

  let payrollStatusCounts: AdminPayrollStatusCounts | null = null;
  if (includePayroll) {
    payrollStatusCounts = {
      draft: 0,
      pending: 0,
      approved: 0,
      paid: 0,
      cancelled: 0,
    };
    for (const row of mockPayrollRecords) {
      incrementMockPayrollStatus(payrollStatusCounts, row.status);
    }
  }

  return {
    totalEmployees: mockEmployees.length,
    pendingLeaveRequests,
    presentTodayPercent,
    presentTodayCount,
    activeEmployeeCount,
    weeklyAttendance: monFirst,
    recentHires,
    payrollStatusCounts,
    includePayrollMetrics: includePayroll,
  };
}

/**
 * Org-wide admin KPIs. Requires reports.view so EMPLOYEE cannot pull aggregates.
 * Auth runs before mock/real branch. Production + real-data-off fails closed.
 */
export async function getAdminDashboardAction(): Promise<
  ActionResult<AdminDashboardData>
> {
  let user: AuthUser;
  try {
    user = await requireReportsView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return { success: true, data: buildMockAdminDashboard(user) };
  }

  try {
    const data = await getAdminDashboardData();
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
