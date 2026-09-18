/**
 * Reports service — read-only aggregations for the Reports dashboard.
 * All data is tenant-scoped via getTenantPrisma(); never trusts client companyId.
 *
 * Payroll compensation metrics are included only when the actor has payroll.view
 * (or super-admin). Roles with reports.view alone (e.g. SUPERVISOR) receive
 * workforce/attendance/leave metrics without salary figures.
 */

import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { getPermissions } from "@/lib/auth/permissions";
import type { AuthUser } from "@/types/auth";
import * as reportsRepo from "@/lib/repositories/reports.repository";
import type {
  EmployeeStats,
  DepartmentDistribution,
  StatusDistribution,
  EmploymentTypeDistribution,
  RecentHireMetric,
} from "@/lib/reports/employee-metrics";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";
import type { LeaveMetrics } from "@/types/report-metrics";
import type {
  DepartmentPayrollMetric,
  MonthlyPayrollTrend,
} from "@/lib/reports/payroll-metrics";
import type { PayrollStats, PayrollSummary } from "@/types/payroll";
import type { EmployeeStatus, EmploymentType } from "@/types/employee";

export interface ReportsDashboardData {
  employeeStats: EmployeeStats;
  departmentDistribution: DepartmentDistribution[];
  statusDistribution: StatusDistribution[];
  employmentTypeDistribution: EmploymentTypeDistribution[];
  recentHires: RecentHireMetric[];
  attendanceMetrics: AttendanceMetrics;
  leaveMetrics: LeaveMetrics;
  /** Null when the actor lacks payroll.view (server-enforced). */
  payrollStats: PayrollStats | null;
  /** Null when the actor lacks payroll.view (server-enforced). */
  payrollSummary: PayrollSummary | null;
  /** Empty when the actor lacks payroll.view (server-enforced). */
  departmentPayrollMetrics: DepartmentPayrollMetric[];
  /** Empty when the actor lacks payroll.view (server-enforced). */
  monthlyPayrollTrend: MonthlyPayrollTrend[];
  /** Whether compensation metrics were included for this actor. */
  includePayrollMetrics: boolean;
}

function canViewPayrollMetrics(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  const p = getPermissions(user.role);
  return p.payroll.view || p.payroll.generate || p.payroll.approve || p.payroll.upload;
}

function mapEmployeeStatus(dbStatus: string): EmployeeStatus {
  if (dbStatus === "RESIGNED") return "INACTIVE";
  if (
    dbStatus === "ACTIVE" ||
    dbStatus === "ON_LEAVE" ||
    dbStatus === "TERMINATED" ||
    dbStatus === "INACTIVE"
  ) {
    return dbStatus as EmployeeStatus;
  }
  return "INACTIVE";
}

const MONTH_ORDER = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export async function getReportsDashboard(): Promise<ReportsDashboardData> {
  const { companyId, user } = await getTenantPrisma();
  const includePayroll = canViewPayrollMetrics(user);

  const [
    totalEmployees,
    statusGroups,
    typeGroups,
    deptGroups,
    departments,
    recentHireRows,
    attendanceStatusGroups,
    attendanceHours,
    regularizationCount,
    leaveStatusGroups,
    payrollAmountAgg,
    payrollStatusSums,
    payrollEmployeeCount,
    payrollTrendGroups,
    payrollDeptGroups,
  ] = await Promise.all([
    reportsRepo.countEmployees(companyId),
    reportsRepo.groupEmployeesByStatus(companyId),
    reportsRepo.groupEmployeesByEmploymentType(companyId),
    reportsRepo.groupEmployeesByDepartment(companyId),
    reportsRepo.listDepartmentsForCompany(companyId),
    reportsRepo.findRecentHires(companyId, 5),
    reportsRepo.groupAttendanceByStatus(companyId),
    reportsRepo.aggregateAttendanceHours(companyId),
    reportsRepo.countRegularizedAttendance(companyId),
    reportsRepo.groupLeaveByStatus(companyId),
    includePayroll
      ? reportsRepo.aggregatePayrollAmounts(companyId)
      : Promise.resolve(null),
    includePayroll
      ? reportsRepo.sumNetSalaryByPayrollStatus(companyId)
      : Promise.resolve(null),
    includePayroll
      ? reportsRepo.distinctPayrollEmployeeCount(companyId)
      : Promise.resolve(0),
    includePayroll
      ? reportsRepo.groupPayrollTrendByMonthYear(companyId)
      : Promise.resolve([]),
    includePayroll
      ? reportsRepo.groupPayrollByDepartmentName(companyId)
      : Promise.resolve([]),
  ]);

  const statusCount: Record<string, number> = {};
  for (const g of statusGroups) {
    const key = mapEmployeeStatus(g.status);
    statusCount[key] = (statusCount[key] ?? 0) + g._count._all;
  }

  const typeCount: Record<string, number> = {};
  for (const g of typeGroups) {
    typeCount[g.employmentType] = g._count._all;
  }

  const employeeStats: EmployeeStats = {
    totalEmployees,
    activeCount: statusCount.ACTIVE ?? 0,
    inactiveCount: statusCount.INACTIVE ?? 0,
    onLeaveCount: statusCount.ON_LEAVE ?? 0,
    terminatedCount: statusCount.TERMINATED ?? 0,
    fullTimeCount: typeCount.FULL_TIME ?? 0,
    partTimeCount: typeCount.PART_TIME ?? 0,
    contractCount: typeCount.CONTRACT ?? 0,
    internCount: typeCount.INTERN ?? 0,
  };

  const statusDistribution: StatusDistribution[] = (
    ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"] as EmployeeStatus[]
  )
    .filter((s) => (statusCount[s] ?? 0) > 0)
    .map((status) => ({ status, count: statusCount[status] ?? 0 }));

  const employmentTypeDistribution: EmploymentTypeDistribution[] = (
    ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"] as EmploymentType[]
  )
    .filter((t) => (typeCount[t] ?? 0) > 0)
    .map((employmentType) => ({
      employmentType,
      count: typeCount[employmentType] ?? 0,
    }));

  const departmentDistribution: DepartmentDistribution[] = deptGroups.map(
    (g) => ({
      departmentId: g.departmentId ?? "unassigned",
      count: g._count._all,
    })
  );

  const recentHires: RecentHireMetric[] = recentHireRows.map((emp) => ({
    id: emp.id,
    employeeId: emp.employeeCode,
    name: `${emp.firstName} ${emp.lastName}`.trim(),
    designation: emp.designation,
    joiningDate: emp.joiningDate.toISOString().slice(0, 10),
    workLocation: "Remote",
  }));

  const attStatus: Record<string, number> = {};
  for (const g of attendanceStatusGroups) {
    attStatus[g.status] = g._count._all;
  }

  const attendanceMetrics: AttendanceMetrics = {
    totalRecords: attendanceHours._count._all,
    presentCount: attStatus.PRESENT ?? 0,
    lateCount: attStatus.LATE ?? 0,
    halfDayCount: attStatus.HALF_DAY ?? 0,
    absentCount: attStatus.ABSENT ?? 0,
    onLeaveCount: attStatus.ON_LEAVE ?? 0,
    averageWorkingHours:
      Math.round((attendanceHours._avg.totalHours ?? 0) * 100) / 100,
    totalOvertimeHours:
      Math.round((attendanceHours._sum.overtimeHours ?? 0) * 100) / 100,
    regularizationCount,
  };

  const leaveStatus: Record<string, number> = {};
  let leaveTotal = 0;
  for (const g of leaveStatusGroups) {
    leaveStatus[g.status] = g._count._all;
    leaveTotal += g._count._all;
  }

  const leaveMetrics: LeaveMetrics = {
    totalRequests: leaveTotal,
    approvedRequests: leaveStatus.APPROVED ?? 0,
    pendingRequests: leaveStatus.PENDING ?? 0,
    rejectedRequests: leaveStatus.REJECTED ?? 0,
    cancelledRequests: leaveStatus.CANCELLED ?? 0,
  };

  if (!includePayroll || !payrollAmountAgg || !payrollStatusSums) {
    return {
      employeeStats,
      departmentDistribution,
      statusDistribution,
      employmentTypeDistribution,
      recentHires,
      attendanceMetrics,
      leaveMetrics,
      payrollStats: null,
      payrollSummary: null,
      departmentPayrollMetrics: [],
      monthlyPayrollTrend: [],
      includePayrollMetrics: false,
    };
  }

  const payrollStats: PayrollStats = {
    employeeCount: payrollEmployeeCount,
    totalGrossSalary: payrollAmountAgg._sum.grossSalary ?? 0,
    totalNetSalary: payrollAmountAgg._sum.netSalary ?? 0,
    totalAllowances: payrollAmountAgg._sum.totalAllowances ?? 0,
    totalDeductions: payrollAmountAgg._sum.totalDeductions ?? 0,
    averageNetSalary:
      Math.round((payrollAmountAgg._avg.netSalary ?? 0) * 100) / 100,
  };

  const payrollSummary: PayrollSummary = {
    totalPayrollRecords: payrollAmountAgg._count._all,
    totalEmployees: payrollEmployeeCount,
    paidPayroll: 0,
    pendingPayroll: 0,
    approvedPayroll: 0,
    draftPayroll: 0,
  };

  for (const g of payrollStatusSums) {
    const net = g._sum.netSalary ?? 0;
    switch (g.status) {
      case "PAID":
        payrollSummary.paidPayroll = net;
        break;
      case "PENDING":
        payrollSummary.pendingPayroll = net;
        break;
      case "APPROVED":
        payrollSummary.approvedPayroll = net;
        break;
      case "DRAFT":
        payrollSummary.draftPayroll = net;
        break;
    }
  }

  // Resolve department labels → ids from tenant department list when possible.
  const deptIdByName = new Map(
    departments.map((d) => [d.departmentName, d.id] as const)
  );

  const departmentPayrollMetrics: DepartmentPayrollMetric[] =
    payrollDeptGroups.map((g) => {
      const label =
        g.departmentName && g.departmentName.trim().length > 0
          ? g.departmentName
          : "Unassigned";
      const matchedId = g.departmentName
        ? deptIdByName.get(g.departmentName)
        : undefined;
      return {
        departmentId: matchedId ?? "unassigned",
        departmentName: label,
        totalGross: g._sum.grossSalary ?? 0,
        totalNet: g._sum.netSalary ?? 0,
        recordCount: g._count._all,
      };
    });

  const monthlyPayrollTrend: MonthlyPayrollTrend[] = payrollTrendGroups
    .map((g) => ({
      month: g.month,
      year: g.year,
      totalGross: g._sum.grossSalary ?? 0,
      totalNet: g._sum.netSalary ?? 0,
      recordCount: g._count._all,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month);
    });

  return {
    employeeStats,
    departmentDistribution,
    statusDistribution,
    employmentTypeDistribution,
    recentHires,
    attendanceMetrics,
    leaveMetrics,
    payrollStats,
    payrollSummary,
    departmentPayrollMetrics,
    monthlyPayrollTrend,
    includePayrollMetrics: true,
  };
}
