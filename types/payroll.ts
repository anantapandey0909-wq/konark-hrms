import type { Department } from "./department";

export type PayrollStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "PAID"
  | "CANCELLED";

export type PayrollMonth =
  | "JANUARY"
  | "FEBRUARY"
  | "MARCH"
  | "APRIL"
  | "MAY"
  | "JUNE"
  | "JULY"
  | "AUGUST"
  | "SEPTEMBER"
  | "OCTOBER"
  | "NOVEMBER"
  | "DECEMBER";

export interface PayrollAllowance {
  id: string;
  name: string;
  amount: number;
}

export interface PayrollDeduction {
  id: string;
  name: string;
  amount: number;
}

export interface PayrollAttendanceSummary {
  workingDays: number;
  presentDays: number;
  absentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  overtimeHours: number;
  lateEntries: number;
}

export interface PayrollLeaveSummary {
  totalLeaves: number;
  paidLeaves: number;
  unpaidLeaves: number;
  leaveWithoutPayDays: number;
}

export interface SalaryBreakdown {
  basicSalary: number;
  grossSalary: number;
  taxableIncome: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
}

export interface PayrollRecord {
  id: string;
  payrollNumber: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: Department;
  designation: string;
  month: PayrollMonth;
  year: number;
  status: PayrollStatus;
  payPeriodStart: string;
  payPeriodEnd: string;
  attendanceSummary: PayrollAttendanceSummary;
  leaveSummary: PayrollLeaveSummary;
  salaryBreakdown: SalaryBreakdown;
  generatedAt: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollSummary {
  totalPayrollRecords: number;
  totalEmployees: number;
  paidPayroll: number;
  pendingPayroll: number;
  approvedPayroll: number;
  draftPayroll: number;
}

export interface PayrollStats {
  employeeCount: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  averageNetSalary: number;
}

export interface PayrollFilters {
  search: string;
  department: Department | "ALL";
  status: PayrollStatus | "ALL";
  month: PayrollMonth | "ALL";
  year: number | "ALL";
}