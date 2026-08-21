import { PayrollRecord, PayrollFilters } from "@/types/payroll";

export interface PayrollSummary {
  readonly totalBasicSalary: number;
  readonly totalAllowances: number;
  readonly totalDeductions: number;
  readonly totalNetSalary: number;
}

export interface PayrollStatistics {
  readonly totalRecordsCount: number;
  readonly paidCount: number;
  readonly pendingCount: number;
  readonly approvedCount: number;
  readonly draftCount: number;
  readonly cancelledCount: number;
  readonly averageNetSalary: number;
}

export function calculateGrossSalary(basicSalary: number, totalAllowances: number): number {
  return Math.round((basicSalary + totalAllowances) * 100) / 100;
}

export function calculateNetSalary(grossSalary: number, totalDeductions: number): number {
  const net = grossSalary - totalDeductions;
  return Math.max(0, Math.round(net * 100) / 100);
}

export function calculateOvertimePay(hourlyRate: number, overtimeHours: number, multiplier = 1.5): number {
  if (overtimeHours <= 0) return 0;
  return Math.round(hourlyRate * overtimeHours * multiplier * 100) / 100;
}

export function calculateAttendanceImpact(basicSalary: number, totalWorkDays: number, presentDays: number): number {
  if (totalWorkDays <= 0 || presentDays >= totalWorkDays) return basicSalary;
  const proRataSalary = (basicSalary / totalWorkDays) * presentDays;
  return Math.round(proRataSalary * 100) / 100;
}

export function calculateLeaveImpact(basicSalary: number, totalWorkDays: number, unpaidLeaveDays: number): number {
  if (totalWorkDays <= 0 || unpaidLeaveDays <= 0) return 0;
  const deduction = (basicSalary / totalWorkDays) * unpaidLeaveDays;
  return Math.round(deduction * 100) / 100;
}

export function calculatePayrollSummary(records: readonly PayrollRecord[]): PayrollSummary {
  let totalBasicSalary = 0;
  let totalAllowances = 0;
  let totalDeductions = 0;
  let totalNetSalary = 0;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const breakdown = record.salaryBreakdown;
    totalBasicSalary += breakdown.basicSalary;
    totalAllowances += breakdown.totalAllowances;
    totalDeductions += breakdown.totalDeductions;
    totalNetSalary += breakdown.netSalary;
  }

  return {
    totalBasicSalary: Math.round(totalBasicSalary * 100) / 100,
    totalAllowances: Math.round(totalAllowances * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    totalNetSalary: Math.round(totalNetSalary * 100) / 100,
  };
}

export function calculatePayrollStatistics(records: readonly PayrollRecord[]): PayrollStatistics {
  const totalRecordsCount = records.length;
  if (totalRecordsCount === 0) {
    return {
      totalRecordsCount: 0,
      paidCount: 0,
      pendingCount: 0,
      approvedCount: 0,
      draftCount: 0,
      cancelledCount: 0,
      averageNetSalary: 0,
    };
  }

  let paidCount = 0;
  let pendingCount = 0;
  let approvedCount = 0;
  let draftCount = 0;
  let cancelledCount = 0;
  let accumulatedNetSalary = 0;

  for (let i = 0; i < totalRecordsCount; i++) {
    const record = records[i];
    accumulatedNetSalary += record.salaryBreakdown.netSalary;

    switch (record.status) {
      case "PAID":
        paidCount++;
        break;
      case "PENDING":
        pendingCount++;
        break;
      case "APPROVED":
        approvedCount++;
        break;
      case "DRAFT":
        draftCount++;
        break;
      case "CANCELLED":
        cancelledCount++;
        break;
    }
  }

  return {
    totalRecordsCount,
    paidCount,
    pendingCount,
    approvedCount,
    draftCount,
    cancelledCount,
    averageNetSalary: Math.round((accumulatedNetSalary / totalRecordsCount) * 100) / 100,
  };
}

export function filterPayrollRecords(
  records: readonly PayrollRecord[],
  filters: PayrollFilters
): readonly PayrollRecord[] {
  let result = [...records];

  if (filters.month && filters.month !== "ALL") {
    result = result.filter((r) => r.month === filters.month);
  }

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((r) => r.status === filters.status);
  }

  const filterObj = filters as unknown as Record<string, unknown>;

  if (typeof filterObj.employeeId === "string" && filterObj.employeeId) {
    result = result.filter((r) => r.employeeId === filterObj.employeeId);
  }

  if (typeof filterObj.department === "string" && filterObj.department && filterObj.department !== "ALL") {
    result = result.filter((r) => {
      const recordObj = r as unknown as Record<string, unknown>;
      return recordObj.department === filterObj.department;
    });
  }

  return result;
}

export function sortPayrollRecords(
  records: readonly PayrollRecord[],
  field: "month" | "netSalary" | "basicSalary",
  order: "asc" | "desc" = "asc"
): readonly PayrollRecord[] {
  const result = [...records];

  result.sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "month":
        comparison = a.month.localeCompare(b.month);
        break;
      case "netSalary":
        comparison = a.salaryBreakdown.netSalary - b.salaryBreakdown.netSalary;
        break;
      case "basicSalary":
        comparison = a.salaryBreakdown.basicSalary - b.salaryBreakdown.basicSalary;
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });

  return result;
}

/** Formats amounts as Indian Rupees by default. */
export function formatCurrency(
  amount: number,
  locale = "en-IN",
  currency = "INR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}
