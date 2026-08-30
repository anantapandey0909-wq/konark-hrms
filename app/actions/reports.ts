"use server";

import {
  assertProductionRealData,
  requireReportsView,
} from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { getPermissions } from "@/lib/auth/permissions";
import { toSafeActionResult } from "@/lib/errors/app-error";
import { getReportsDashboard } from "@/lib/services/reports.service";
import type { ReportsDashboardData } from "@/lib/services/reports.service";
import { mockEmployees } from "@/mock/employee";
import { mockPayrollRecords } from "@/mock/payroll";
import { mockLeaveRequests } from "@/mock/leave";
import { mockAttendances } from "@/mock/attendance";
import {
  getEmployeeStats,
  getDepartmentDistribution,
  getStatusDistribution,
  getEmploymentTypeDistribution,
  getRecentHires,
} from "@/lib/reports/employee-metrics";
import { calculateAttendanceMetrics } from "@/lib/reports/attendance-metrics";
import { calculateLeaveMetrics } from "@/lib/reports/leave-metrics";
import {
  getPayrollStats,
  getPayrollSummary,
  getDepartmentPayrollMetrics,
  getMonthlyPayrollTrend,
} from "@/lib/reports/payroll-metrics";
import type { AuthUser } from "@/types/auth";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function canViewPayrollMetrics(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  const p = getPermissions(user.role);
  return (
    p.payroll.view || p.payroll.generate || p.payroll.approve || p.payroll.upload
  );
}

function buildMockReportsDashboard(
  includePayroll: boolean
): ReportsDashboardData {
  const base: ReportsDashboardData = {
    employeeStats: getEmployeeStats(mockEmployees),
    departmentDistribution: getDepartmentDistribution(mockEmployees),
    statusDistribution: getStatusDistribution(mockEmployees),
    employmentTypeDistribution: getEmploymentTypeDistribution(mockEmployees),
    recentHires: getRecentHires(mockEmployees, 5),
    attendanceMetrics: calculateAttendanceMetrics(mockAttendances),
    leaveMetrics: calculateLeaveMetrics(mockLeaveRequests),
    payrollStats: null,
    payrollSummary: null,
    departmentPayrollMetrics: [],
    monthlyPayrollTrend: [],
    includePayrollMetrics: false,
  };

  if (!includePayroll) {
    return base;
  }

  return {
    ...base,
    payrollStats: getPayrollStats(mockPayrollRecords),
    payrollSummary: getPayrollSummary(mockPayrollRecords),
    departmentPayrollMetrics: getDepartmentPayrollMetrics(mockPayrollRecords),
    monthlyPayrollTrend: getMonthlyPayrollTrend(mockPayrollRecords),
    includePayrollMetrics: true,
  };
}

export async function getReportsDashboardAction(): Promise<
  ActionResult<ReportsDashboardData>
> {
  let user;
  try {
    user = await requireReportsView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const includePayroll = canViewPayrollMetrics(user);
  const real = isRealDataEnabled();
  console.info(
    `[reports] getReportsDashboardAction dataSource=${real ? "postgres" : "mock"} includePayroll=${includePayroll}`
  );

  if (!real) {
    return {
      success: true,
      data: buildMockReportsDashboard(includePayroll),
    };
  }

  try {
    const data = await getReportsDashboard();
    return { success: true, data };
  } catch (error) {
    // Do NOT fall back to mock data when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
