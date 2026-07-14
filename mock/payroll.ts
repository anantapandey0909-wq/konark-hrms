import { mockEmployees } from "./employee";
import { Employee } from "../types/employee";
import {
  PayrollRecord,
  PayrollSummary,
  PayrollStats,
  PayrollStatus,
  PayrollMonth,
  PayrollAllowance,
  PayrollDeduction
} from "../types/payroll";

// Month to Number Mapping
const MONTH_TO_NUMBER: Record<PayrollMonth, string> = {
  JANUARY: "01",
  FEBRUARY: "02",
  MARCH: "03",
  APRIL: "04",
  MAY: "05",
  JUNE: "06",
  JULY: "07",
  AUGUST: "08",
  SEPTEMBER: "09",
  OCTOBER: "10",
  NOVEMBER: "11",
  DECEMBER: "12",
};

// Indian Salary Range Mapper based on Designation
const getBasicSalary = (designation: string): number => {
  const d = designation.toLowerCase();
  if (d.includes("director") || d.includes("vp")) return 280000;
  if (d.includes("manager") || d.includes("lead")) return 150000;
  if (d.includes("senior") || d.includes("sr.")) return 95000;
  if (d.includes("intern")) return 25000;
  return 55000; // standard Engineer / default role
};

// Builder: Attendance Summary
const buildAttendanceSummary = (month: PayrollMonth, index: number) => {
  const workingDays = month === "JUNE" ? 20 : month === "JULY" ? 23 : 22;
  const absentDays = index % 5 === 0 ? 1 : 0;
  const paidLeaveDays = index % 7 === 0 ? 2 : index % 11 === 0 ? 1 : 0;
  const unpaidLeaveDays = index % 13 === 0 ? 1 : 0;
  const presentDays = workingDays - absentDays - paidLeaveDays - unpaidLeaveDays;
  const overtimeHours = index % 3 === 0 ? 8 : 0;
  const lateEntries = index % 4 === 0 ? 2 : 0;

  return {
    workingDays,
    presentDays,
    absentDays,
    paidLeaveDays,
    unpaidLeaveDays,
    overtimeHours,
    lateEntries,
  };
};

// Builder: Leave Summary
const buildLeaveSummary = (attendance: ReturnType<typeof buildAttendanceSummary>) => {
  const totalLeaves = attendance.paidLeaveDays + attendance.unpaidLeaveDays;
  return {
    totalLeaves,
    paidLeaves: attendance.paidLeaveDays,
    unpaidLeaves: attendance.unpaidLeaveDays,
    leaveWithoutPayDays: attendance.unpaidLeaveDays,
  };
};

// Builder: Salary Breakdown
const buildSalaryBreakdown = (
  employeeId: string,
  month: PayrollMonth,
  basicSalary: number,
  status: PayrollStatus,
  attendance: ReturnType<typeof buildAttendanceSummary>
) => {
  const hra = Math.round(basicSalary * 0.40);
  const transport = 1600;
  const medical = 1250;
  const internet = 1000;
  const bonus = (status === "PAID" || status === "APPROVED") ? Math.round(basicSalary * 0.10) : 0;

  const allowances: PayrollAllowance[] = [
    { id: `all-hra-${employeeId}-${month}`, name: "HRA", amount: hra },
    { id: `all-trans-${employeeId}-${month}`, name: "Transport", amount: transport },
    { id: `all-med-${employeeId}-${month}`, name: "Medical", amount: medical },
    { id: `all-net-${employeeId}-${month}`, name: "Internet", amount: internet },
  ];

  if (bonus > 0) {
    allowances.push({ id: `all-perf-${employeeId}-${month}`, name: "Performance Bonus", amount: bonus });
  }

  const totalAllowances = allowances.reduce((sum, item) => sum + item.amount, 0);
  const grossSalary = basicSalary + totalAllowances;

  const pf = Math.round(basicSalary * 0.12);
  const profTax = 200;
  const incomeTax = Math.round(grossSalary * 0.10);
  const insurance = 1000;

  const deductions: PayrollDeduction[] = [
    { id: `ded-pf-${employeeId}-${month}`, name: "PF", amount: pf },
    { id: `ded-pt-${employeeId}-${month}`, name: "Professional Tax", amount: profTax },
    { id: `ded-tax-${employeeId}-${month}`, name: "Income Tax", amount: incomeTax },
    { id: `ded-ins-${employeeId}-${month}`, name: "Insurance", amount: insurance },
  ];

  if (attendance.unpaidLeaveDays > 0) {
    const perDaySalary = Math.round(basicSalary / attendance.workingDays);
    deductions.push({
      id: `ded-lwp-${employeeId}-${month}`,
      name: "Leave Without Pay",
      amount: perDaySalary * attendance.unpaidLeaveDays,
    });
  }

  const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
  const netSalary = grossSalary - totalDeductions;
  const taxableIncome = Math.max(0, grossSalary - pf - profTax);

  return {
    basicSalary,
    grossSalary,
    taxableIncome,
    totalAllowances,
    totalDeductions,
    netSalary,
    allowances,
    deductions,
  };
};

// Builder: Single Payroll Record
const buildPayrollRecord = (
  employee: Employee,
  index: number,
  month: PayrollMonth,
  year: number
): PayrollRecord => {
  const employeeId = employee.id;
  const employeeCode = employee.employeeCode;
  const employeeName = employee.fullName;
  const department = employee.department;
  const designation = employee.designation;

  let status: PayrollStatus = "PAID";
  if (month === "AUGUST") {
    const mod = index % 10;
    if (mod === 0) status = "DRAFT";
    else if (mod === 1) status = "PENDING";
    else if (mod >= 2 && mod <= 3) status = "APPROVED";
    else status = "PAID";
  }

  const attendanceSummary = buildAttendanceSummary(month, index);
  const leaveSummary = buildLeaveSummary(attendanceSummary);
  const basicSalary = getBasicSalary(designation);
  const salaryBreakdown = buildSalaryBreakdown(employeeId, month, basicSalary, status, attendanceSummary);

  const monthNum = MONTH_TO_NUMBER[month];
  const daysInMonth = month === "JUNE" ? "30" : "31";
  const payPeriodStart = `${year}-${monthNum}-01`;
  const payPeriodEnd = `${year}-${monthNum}-${daysInMonth}`;

  const pad = (num: number) => num.toString().padStart(3, "0");
  const payrollNumber = `PAY-${year}-${monthNum}-${pad(index + 1)}`;

  const generatedAt = `${payPeriodEnd}T18:00:00.000Z`;
  const paidAt = status === "PAID" ? `${payPeriodEnd}T11:00:00.000Z` : undefined;
  const notes = status === "DRAFT" ? "Draft payroll calculated for verification." : undefined;
  const createdAt = `${payPeriodStart}T09:00:00.000Z`;
  const updatedAt = generatedAt;

  return {
    id: payrollNumber,
    payrollNumber,
    employeeId,
    employeeCode,
    employeeName,
    department,
    designation,
    month,
    year,
    status,
    payPeriodStart,
    payPeriodEnd,
    attendanceSummary,
    leaveSummary,
    salaryBreakdown,
    generatedAt,
    paidAt,
    notes,
    createdAt,
    updatedAt,
  };
};

// Generate Mock Records
const generateMockPayrollRecords = (): PayrollRecord[] => {
  const records: PayrollRecord[] = [];
  const months: PayrollMonth[] = ["JUNE", "JULY", "AUGUST"];
  const year = 2024;

  mockEmployees.forEach((employee: Employee, index: number) => {
    months.forEach((month) => {
      records.push(buildPayrollRecord(employee, index, month, year));
    });
  });

  return records;
};

export const mockPayrollRecords: PayrollRecord[] = generateMockPayrollRecords();

// Mock Payroll Summary
export const mockPayrollSummary: PayrollSummary = {
  totalPayrollRecords: mockPayrollRecords.length,
  totalEmployees: new Set(mockPayrollRecords.map((r) => r.employeeId)).size,
  paidPayroll: mockPayrollRecords.filter((r) => r.status === "PAID").length,
  pendingPayroll: mockPayrollRecords.filter((r) => r.status === "PENDING").length,
  approvedPayroll: mockPayrollRecords.filter((r) => r.status === "APPROVED").length,
  draftPayroll: mockPayrollRecords.filter((r) => r.status === "DRAFT").length,
};


// Mock Payroll Stats
export const mockPayrollStats: PayrollStats = {
  employeeCount: new Set(mockPayrollRecords.map((r) => r.employeeId)).size,
  totalGrossSalary: mockPayrollRecords.reduce((sum, r) => sum + r.salaryBreakdown.grossSalary, 0),
  totalNetSalary: mockPayrollRecords.reduce((sum, r) => sum + r.salaryBreakdown.netSalary, 0),
  totalAllowances: mockPayrollRecords.reduce((sum, r) => sum + r.salaryBreakdown.totalAllowances, 0),
  totalDeductions: mockPayrollRecords.reduce((sum, r) => sum + r.salaryBreakdown.totalDeductions, 0),
  averageNetSalary: mockPayrollRecords.length > 0
    ? Math.round(mockPayrollRecords.reduce((sum, r) => sum + r.salaryBreakdown.netSalary, 0) / mockPayrollRecords.length)
    : 0,
};

// Helper Functions
export const getPayrollById = (id: string): PayrollRecord | undefined => {
  return mockPayrollRecords.find((r) => r.id === id || r.payrollNumber === id);
};

export const getPayrollByEmployee = (employeeId: string): PayrollRecord[] => {
  return mockPayrollRecords.filter((r) => r.employeeId === employeeId);
};

export const getPayrollByStatus = (status: PayrollStatus): PayrollRecord[] => {
  return mockPayrollRecords.filter((r) => r.status === status);
};

export const getPayrollByMonth = (month: PayrollMonth): PayrollRecord[] => {
  return mockPayrollRecords.filter((r) => r.month === month);
};
