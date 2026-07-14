import { z } from "zod";

// 2. Shared constants
export const PAYROLL_STATUS_VALUES = ["DRAFT", "PENDING", "APPROVED", "PAID", "CANCELLED"] as const;

export const PAYROLL_MONTH_VALUES = [
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
] as const;

export const DEPARTMENT_VALUES = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
] as const;

// 3. Primitive schemas
export const payrollAllowanceSchema = z.object({
  id: z.string().min(1, "Allowance ID is required"),
  name: z.string().trim().min(1, "Allowance name is required"),
  amount: z.number({ message: "Allowance amount is required" })
    .min(0, "Allowance amount cannot be negative"),
});

export const payrollDeductionSchema = z.object({
  id: z.string().min(1, "Deduction ID is required"),
  name: z.string().trim().min(1, "Deduction name is required"),
  amount: z.number({ message: "Deduction amount is required" })
    .min(0, "Deduction amount cannot be negative"),
});

// 4. Attendance schema
export const payrollAttendanceSummarySchema = z.object({
  workingDays: z.number({ message: "Working days is required" })
    .min(0, "Working days cannot be negative"),
  presentDays: z.number({ message: "Present days is required" })
    .min(0, "Present days cannot be negative"),
  absentDays: z.number({ message: "Absent days is required" })
    .min(0, "Absent days cannot be negative"),
  paidLeaveDays: z.number({ message: "Paid leave days is required" })
    .min(0, "Paid leave days cannot be negative"),
  unpaidLeaveDays: z.number({ message: "Unpaid leave days is required" })
    .min(0, "Unpaid leave days cannot be negative"),
  overtimeHours: z.number({ message: "Overtime hours is required" })
    .min(0, "Overtime hours cannot be negative"),
  lateEntries: z.number({ message: "Late entries is required" })
    .min(0, "Late entries cannot be negative"),
});

// 5. Leave schema
export const payrollLeaveSummarySchema = z.object({
  totalLeaves: z.number({ message: "Total leaves is required" })
    .min(0, "Total leaves cannot be negative"),
  paidLeaves: z.number({ message: "Paid leaves is required" })
    .min(0, "Paid leaves cannot be negative"),
  unpaidLeaves: z.number({ message: "Unpaid leaves is required" })
    .min(0, "Unpaid leaves cannot be negative"),
  leaveWithoutPayDays: z.number({ message: "Leave without pay days is required" })
    .min(0, "Leave without pay days cannot be negative"),
});

// 6. Salary schema
export const salaryBreakdownSchema = z.object({
  basicSalary: z.number({ message: "Basic salary is required" })
    .min(0, "Basic salary cannot be negative"),
  grossSalary: z.number({ message: "Gross salary is required" })
    .min(0, "Gross salary cannot be negative"),
  taxableIncome: z.number({ message: "Taxable income is required" })
    .min(0, "Taxable income cannot be negative"),
  totalAllowances: z.number({ message: "Total allowances is required" })
    .min(0, "Total allowances cannot be negative"),
  totalDeductions: z.number({ message: "Total deductions is required" })
    .min(0, "Total deductions cannot be negative"),
  netSalary: z.number({ message: "Net salary is required" })
    .min(0, "Net salary cannot be negative"),
  allowances: z.array(payrollAllowanceSchema).default([]),
  deductions: z.array(payrollDeductionSchema).default([]),
});

// 7. payrollBaseSchema
export const payrollBaseSchema = z.object({
  payrollNumber: z.string().trim().min(1, "Payroll number is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  employeeCode: z.string().trim().min(1, "Employee code is required"),
  employeeName: z.string().trim().min(1, "Employee name is required"),
  department: z.enum(DEPARTMENT_VALUES, { message: "Department is required" }),
  designation: z.string().trim().min(1, "Designation is required"),
  month: z.enum(PAYROLL_MONTH_VALUES, { message: "Month is required" }),
  year: z.number({ message: "Year is required" })
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Year cannot exceed 2100"),
  status: z.enum(PAYROLL_STATUS_VALUES, { message: "Status is required" }),
  payPeriodStart: z.string().min(1, "Pay period start is required"),
  payPeriodEnd: z.string().min(1, "Pay period end is required"),
  attendanceSummary: payrollAttendanceSummarySchema,
  leaveSummary: payrollLeaveSummarySchema,
  salaryBreakdown: salaryBreakdownSchema,
  generatedAt: z.string().min(1, "Generation date is required"),
  paidAt: z.string().optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),
});

// 8. createPayrollSchema
export const createPayrollSchema = payrollBaseSchema;

// 9. updatePayrollSchema
export const updatePayrollSchema = payrollBaseSchema;

// 10. Inferred types
export type PayrollBaseFormData = z.input<typeof payrollBaseSchema>;
export type CreatePayrollFormData = z.input<typeof createPayrollSchema>;
export type UpdatePayrollFormData = z.input<typeof updatePayrollSchema>;
