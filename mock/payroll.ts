import type { 
  PayrollRecord, 
  PayrollMonth, 
  PayrollStatus, 
  SalaryBreakdown, 
  PayrollAllowance, 
  PayrollDeduction,
  PayrollAttendanceSummary,
  PayrollLeaveSummary
} from "@/types/payroll";
import type { Department } from "@/types/department";
import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";
import { mockAttendances } from "@/mock/attendance";
import { mockLeaveRequests } from "@/mock/leave";

const SALARY_BANDS = {
  LEADERSHIP: { baseline: 12000, label: "Leadership" },
  SENIOR: { baseline: 8000, label: "Senior" },
  ASSOCIATE: { baseline: 5000, label: "Associate" },
} as const;

const fallbackDepartment: Department = {
  id: "dept-fallback",
  tenantId: "tenant-konark-tech",
  name: "General",
  code: "GEN",
  description: "Fallback Department",
  managerId: null,
  parentDepartmentId: null,
  status: "ACTIVE",
  sortOrder: 1,
  budget: null,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

const getMonthDetails = (month: PayrollMonth, year: number): { code: string; days: number } => {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const MONTH_MAP: Record<PayrollMonth, { code: string; days: number }> = {
    JANUARY: { code: "01", days: 31 },
    FEBRUARY: { code: "02", days: isLeapYear ? 29 : 28 },
    MARCH: { code: "03", days: 31 },
    APRIL: { code: "04", days: 30 },
    MAY: { code: "05", days: 31 },
    JUNE: { code: "06", days: 30 },
    JULY: { code: "07", days: 31 },
    AUGUST: { code: "08", days: 31 },
    SEPTEMBER: { code: "09", days: 30 },
    OCTOBER: { code: "10", days: 31 },
    NOVEMBER: { code: "11", days: 30 },
    DECEMBER: { code: "12", days: 31 },
  };
  return MONTH_MAP[month];
};

export const calculateSalaryBreakdown = (basicSalary: number): SalaryBreakdown => {
  const hra: PayrollAllowance = { id: "all-hra", name: "House Rent Allowance", amount: Math.round(basicSalary * 0.4) };
  const lta: PayrollAllowance = { id: "all-lta", name: "Leave Travel Allowance", amount: Math.round(basicSalary * 0.1) };
  const special: PayrollAllowance = { id: "all-spl", name: "Special Allowance", amount: 500 };
  
  const pf: PayrollDeduction = { id: "ded-pf", name: "Provident Fund", amount: Math.round(basicSalary * 0.12) };
  const tax: PayrollDeduction = { id: "ded-tax", name: "Professional Tax", amount: 200 };
  const insurance: PayrollDeduction = { id: "ded-ins", name: "Health Insurance", amount: 150 };

  const allowances = [hra, lta, special];
  const deductions = [pf, tax, insurance];

  const totalAllowances = allowances.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDeductions = deductions.reduce((acc, curr) => acc + curr.amount, 0);
  
  const grossSalary = basicSalary + totalAllowances;
  const taxableIncome = Math.max(0, grossSalary - totalDeductions);
  const netSalary = grossSalary - totalDeductions;

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

export const generatePayrollRecord = (
  id: string,
  payrollNumber: string,
  employeeId: string,
  month: PayrollMonth,
  year: number,
  status: PayrollStatus
): PayrollRecord => {
  const employee = mockEmployees.find((emp) => emp.id === employeeId);
  if (!employee) {
    throw new Error(`Employee with ID ${employeeId} not found in mock data.`);
  }

  const department = mockDepartments.find((d) => d.id === employee.departmentId) ?? fallbackDepartment;

  const isLeadership = employee.designation.includes("VP") || employee.designation.includes("Director") || employee.designation.includes("Principal");
  const isSenior = employee.designation.includes("Senior") || employee.designation.includes("Lead") || employee.designation.includes("Staff");

  const band = isLeadership 
    ? SALARY_BANDS.LEADERSHIP 
    : isSenior 
      ? SALARY_BANDS.SENIOR 
      : SALARY_BANDS.ASSOCIATE;

  const idNum = parseInt(employee.id.replace(/\D/g, "")) || 0;
  const basicSalary = band.baseline + (idNum % 10) * 200;

  const salaryBreakdown = calculateSalaryBreakdown(basicSalary);

  const monthDetails = getMonthDetails(month, year);

  const empAttendances = mockAttendances.filter(
    (att) => att.employeeId === employeeId && att.attendanceDate.startsWith(`${year}-${monthDetails.code}`)
  );

  const presentDays = empAttendances.filter((att) => att.status === "PRESENT" || att.status === "LATE").length || 20;
  const lateEntries = empAttendances.filter((att) => att.status === "LATE").length || 2;
  const overtimeHours = empAttendances.reduce((acc, curr) => acc + (curr.overtimeHours ?? 0), 0) || 5;

  const empLeaves = mockLeaveRequests.filter(
    (lv) => lv.employeeId === employeeId && lv.status === "APPROVED"
  );
  const totalLeaves = empLeaves.reduce((acc, curr) => acc + curr.totalDays, 0) || 2;

  const attendanceSummary: PayrollAttendanceSummary = {
    workingDays: monthDetails.days - 8,
    presentDays,
    absentDays: Math.max(0, (monthDetails.days - 8) - presentDays - totalLeaves),
    paidLeaveDays: totalLeaves,
    unpaidLeaveDays: 0,
    overtimeHours,
    lateEntries,
  };

  const leaveSummary: PayrollLeaveSummary = {
    totalLeaves,
    paidLeaves: totalLeaves,
    unpaidLeaves: 0,
    leaveWithoutPayDays: 0,
  };

  const payPeriodStart = `${year}-${monthDetails.code}-01`;
  const payPeriodEnd = `${year}-${monthDetails.code}-${monthDetails.days}`;

  const record: PayrollRecord = {
    id,
    payrollNumber,
    employeeId: employee.id,
    employeeCode: employee.employeeId,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    department,
    designation: employee.designation,
    month,
    year,
    status,
    payPeriodStart,
    payPeriodEnd,
    attendanceSummary,
    leaveSummary,
    salaryBreakdown,
    generatedAt: `${year}-${monthDetails.code}-28T09:00:00.000Z`,
    paidAt: status === "PAID" ? `${year}-${monthDetails.code}-${monthDetails.days}T15:30:00.000Z` : undefined,
    notes: `Monthly standard payroll release for ${month} ${year}.`,
    createdAt: `${year}-${monthDetails.code}-28T09:00:00.000Z`,
    updatedAt: `${year}-${monthDetails.code}-${monthDetails.days}T15:30:00.000Z`,
  };

  return record;
};

const januaryRecords: PayrollRecord[] = mockEmployees
  .slice(0, 12)
  .map((emp, index) => {
    const paddedIndex = String(index + 1).padStart(3, "0");
    const status: PayrollStatus = index % 4 === 0 ? "APPROVED" : index % 4 === 1 ? "PAID" : index % 4 === 2 ? "PENDING" : "DRAFT";
    return generatePayrollRecord(
      `pay-jan-2025-${emp.id}`,
      `PAY-2025-01-${paddedIndex}`,
      emp.id,
      "JANUARY",
      2025,
      status
    );
  });

const decemberRecords: PayrollRecord[] = mockEmployees
  .slice(0, 8)
  .map((emp, index) => {
    const paddedIndex = String(index + 20).padStart(3, "0");
    return generatePayrollRecord(
      `pay-dec-2024-${emp.id}`,
      `PAY-2024-12-${paddedIndex}`,
      emp.id,
      "DECEMBER",
      2024,
      "PAID"
    );
  });

export const mockPayrollRecords: PayrollRecord[] = [
  ...januaryRecords,
  ...decemberRecords,
];