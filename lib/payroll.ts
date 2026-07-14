import {
  PayrollRecord,
  PayrollSummary,
  PayrollStats,
  PayrollStatus,
  PayrollMonth,
  PayrollAllowance,
  PayrollDeduction,
  PayrollFilters
} from "../types/payroll";

// ==========================================
// Shared Types
// ==========================================
export type PayrollSortField = "employeeName" | "generatedAt" | "month" | "netSalary";
export type PayrollSortDirection = "asc" | "desc";

// ==========================================
// 1. Formatting Helpers
// ==========================================

/**
 * Formats a numeric amount into Indian Rupees (INR) currency format.
 * Example: 125000 -> ₹1,25,000
 * 
 * @param amount - The numeric salary or amount to format.
 * @returns The formatted currency string.
 */
export const formatPayrollCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Converts a string-based PayrollMonth into a capitalized, readable string.
 * Example: JANUARY -> January
 * 
 * @param month - The uppercase payroll month enum value.
 * @returns Capitalized readable month string.
 */
export const formatPayrollMonth = (month: PayrollMonth): string => {
  if (!month) return "";
  const lower = month.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

/**
 * Converts a string-based PayrollStatus into a capitalized, readable string.
 * Example: PAID -> Paid
 * 
 * @param status - The uppercase payroll status enum value.
 * @returns Capitalized readable status string.
 */
export const formatPayrollStatus = (status: PayrollStatus): string => {
  if (!status) return "";
  const lower = status.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

// ==========================================
// 2. Salary Helpers
// ==========================================

/**
 * Calculates the total sum of allowances.
 */
export const calculateTotalAllowances = (allowances: PayrollAllowance[]): number => {
  return allowances.reduce((sum, item) => sum + item.amount, 0);
};

/**
 * Calculates the total sum of deductions.
 */
export const calculateTotalDeductions = (deductions: PayrollDeduction[]): number => {
  return deductions.reduce((sum, item) => sum + item.amount, 0);
};

/**
 * Calculates the gross salary as base salary + total allowances.
 */
export const calculateGrossSalary = (basicSalary: number, allowances: PayrollAllowance[]): number => {
  return basicSalary + calculateTotalAllowances(allowances);
};

/**
 * Calculates the net salary as gross salary - total deductions.
 */
export const calculateNetSalary = (
  basicSalary: number,
  allowances: PayrollAllowance[],
  deductions: PayrollDeduction[]
): number => {
  return calculateGrossSalary(basicSalary, allowances) - calculateTotalDeductions(deductions);
};

/**
 * Calculates taxable income by subtracting standard PF and Professional Tax.
 */
export const calculateTaxableIncome = (
  grossSalary: number,
  deductions: PayrollDeduction[]
): number => {
  const pfDeduction = deductions.find((d) => d.name.toUpperCase() === "PF")?.amount || 0;
  const ptDeduction = deductions.find((d) => d.name.toUpperCase() === "PROFESSIONAL TAX")?.amount || 0;
  return Math.max(0, grossSalary - pfDeduction - ptDeduction);
};

// ==========================================
// 3. Statistics Helpers
// ==========================================

/**
 * Aggregate all global payroll totals.
 */
export const getPayrollTotals = (records: PayrollRecord[]) => {
  return {
    totalGrossSalary: records.reduce((sum, r) => sum + r.salaryBreakdown.grossSalary, 0),
    totalNetSalary: records.reduce((sum, r) => sum + r.salaryBreakdown.netSalary, 0),
    totalAllowances: records.reduce((sum, r) => sum + r.salaryBreakdown.totalAllowances, 0),
    totalDeductions: records.reduce((sum, r) => sum + r.salaryBreakdown.totalDeductions, 0),
  };
};

// ==========================================
// 4. Dashboard Helpers
// ==========================================

/**
 * Generates an overall summary calculation of payroll records.
 */
export const calculatePayrollSummary = (records: PayrollRecord[]): PayrollSummary => {
  return {
    totalPayrollRecords: records.length,
    totalEmployees: new Set(records.map((r) => r.employeeId)).size,
    paidPayroll: records.filter((r) => r.status === "PAID").length,
    pendingPayroll: records.filter((r) => r.status === "PENDING").length,
    approvedPayroll: records.filter((r) => r.status === "APPROVED").length,
    draftPayroll: records.filter((r) => r.status === "DRAFT").length,
  };
};

/**
 * Generates overall analytics/statistics of payroll records.
 * Reuses getPayrollTotals to eliminate duplicate reductions.
 */
export const calculatePayrollStats = (records: PayrollRecord[]): PayrollStats => {
  const totals = getPayrollTotals(records);
  const averageNetSalary = records.length > 0 ? Math.round(totals.totalNetSalary / records.length) : 0;

  return {
    employeeCount: new Set(records.map((r) => r.employeeId)).size,
    totalGrossSalary: totals.totalGrossSalary,
    totalNetSalary: totals.totalNetSalary,
    totalAllowances: totals.totalAllowances,
    totalDeductions: totals.totalDeductions,
    averageNetSalary,
  };
};

// ==========================================
// 5. Filter Helpers
// ==========================================

/**
 * Filters the list of payroll records based on criteria.
 * Supports bypassing filter constraints when values are set to "ALL".
 */
export const filterPayrollRecords = (
  records: PayrollRecord[],
  filters: PayrollFilters
): PayrollRecord[] => {
  let filteredRecords = [...records];

  if (filters.search) {
    filteredRecords = searchPayrollRecords(filteredRecords, filters.search);
  }
  if (filters.department && filters.department !== "ALL") {
    filteredRecords = filteredRecords.filter(
      (r) => r.department.toLowerCase() === filters.department?.toLowerCase()
    );
  }
  if (filters.status && filters.status !== "ALL") {
    filteredRecords = filteredRecords.filter((r) => r.status === filters.status);
  }
  if (filters.month && filters.month !== "ALL") {
    filteredRecords = filteredRecords.filter((r) => r.month === filters.month);
  }
  if (filters.year && String(filters.year) !== "ALL") {
    filteredRecords = filteredRecords.filter((r) => r.year === Number(filters.year));
  }

  return filteredRecords;
};

// ==========================================
// 6. Search Helpers
// ==========================================

/**
 * Searches payroll records by employeeName, employeeCode or payrollNumber.
 */
export const searchPayrollRecords = (records: PayrollRecord[], query: string): PayrollRecord[] => {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return records;

  return records.filter(
    (r) =>
      r.employeeName.toLowerCase().includes(cleanQuery) ||
      r.employeeCode.toLowerCase().includes(cleanQuery) ||
      r.payrollNumber.toLowerCase().includes(cleanQuery)
  );
};

// ==========================================
// 7. Sort Helpers
// ==========================================

/**
 * Sorts payroll records copy without mutating original array.
 */
export const sortPayrollRecords = (
  records: PayrollRecord[],
  sortBy: PayrollSortField,
  sortOrder: PayrollSortDirection
): PayrollRecord[] => {
  const sortedRecords = [...records];
  const orderModifier = sortOrder === "desc" ? -1 : 1;

  const monthWeight: Record<PayrollMonth, number> = {
    JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
    JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12
  };

  sortedRecords.sort((a, b) => {
    switch (sortBy) {
      case "employeeName":
        return a.employeeName.localeCompare(b.employeeName) * orderModifier;
      case "generatedAt":
        return (new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime()) * orderModifier;
      case "month":
        return (monthWeight[a.month] - monthWeight[b.month]) * orderModifier;
      case "netSalary":
        return (a.salaryBreakdown.netSalary - b.salaryBreakdown.netSalary) * orderModifier;
      default:
        return 0;
    }
  });

  return sortedRecords;
};

// ==========================================
// 8. Find Helpers
// ==========================================

/**
 * Finds a payroll record by id or payroll number.
 */
export const getPayrollRecordById = (
  records: PayrollRecord[],
  id: string
): PayrollRecord | undefined => {
  return records.find((r) => r.id === id || r.payrollNumber === id);
};

/**
 * Filters and retrieves history records of a specific employee.
 */
export const getEmployeePayrollHistory = (
  records: PayrollRecord[],
  employeeId: string
): PayrollRecord[] => {
  return records.filter((r) => r.employeeId === employeeId);
};

// ==========================================
// 9. Status Helpers
// ==========================================

export const isPayrollPaid = (record: PayrollRecord): boolean => {
  return record.status === "PAID";
};

export const isPayrollApproved = (record: PayrollRecord): boolean => {
  return record.status === "APPROVED";
};

export const isPayrollPending = (record: PayrollRecord): boolean => {
  return record.status === "PENDING";
};

export const isPayrollDraft = (record: PayrollRecord): boolean => {
  return record.status === "DRAFT";
};

// ==========================================
// 10. Edit Helpers
// ==========================================

/**
 * Checks if a payroll record status allows it to be edited.
 */
export const canEditPayroll = (status: PayrollStatus): boolean => {
  return status === "DRAFT" || status === "PENDING";
};

/**
 * Checks if a payroll record status allows it to be approved.
 */
export const canApprovePayroll = (status: PayrollStatus): boolean => {
  return status === "PENDING";
};

// ==========================================
// 11. Validation Helpers
// ==========================================

export const hasPayrollBeenPaid = (record: PayrollRecord): boolean => {
  return !!record.paidAt;
};

export const hasPayrollNotes = (record: PayrollRecord): boolean => {
  return !!record.notes && record.notes.trim().length > 0;
};

export const hasPayrollAllowances = (record: PayrollRecord): boolean => {
  return record.salaryBreakdown.allowances.length > 0;
};

export const hasPayrollDeductions = (record: PayrollRecord): boolean => {
  return record.salaryBreakdown.deductions.length > 0;
};
export function formatPayrollDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
