"use server";

import { isRealDataEnabled } from "@/lib/config/flags";
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

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function buildMockReportsDashboard(): ReportsDashboardData {
  return {
    employeeStats: getEmployeeStats(mockEmployees),
    departmentDistribution: getDepartmentDistribution(mockEmployees),
    statusDistribution: getStatusDistribution(mockEmployees),
    employmentTypeDistribution: getEmploymentTypeDistribution(mockEmployees),
    recentHires: getRecentHires(mockEmployees, 5),
    attendanceMetrics: calculateAttendanceMetrics(mockAttendances),
    leaveMetrics: calculateLeaveMetrics(mockLeaveRequests),
    payrollStats: getPayrollStats(mockPayrollRecords),
    payrollSummary: getPayrollSummary(mockPayrollRecords),
    departmentPayrollMetrics: getDepartmentPayrollMetrics(mockPayrollRecords),
    monthlyPayrollTrend: getMonthlyPayrollTrend(mockPayrollRecords),
  };
}

export async function getReportsDashboardAction(): Promise<
  ActionResult<ReportsDashboardData>
> {
  const real = isRealDataEnabled();
  console.info(
    `[reports] getReportsDashboardAction dataSource=${real ? "postgres" : "mock"}`
  );

  if (!real) {
    return { success: true, data: buildMockReportsDashboard() };
  }

  try {
    const data = await getReportsDashboard();
    return { success: true, data };
  } catch (error) {
    // Do NOT fall back to mock data when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
