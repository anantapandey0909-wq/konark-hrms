import { z } from "zod";

export const payrollMonthSchema = z.enum([
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
]);

export const payrollStatusSchema = z.enum([
  "DRAFT",
  "PENDING",
  "APPROVED",
  "PAID",
  "CANCELLED",
]);

const allowanceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  amount: z.number().finite(),
});

const deductionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  amount: z.number().finite(),
});

const attendanceSummarySchema = z.object({
  workingDays: z.number().finite().nonnegative(),
  presentDays: z.number().finite().nonnegative(),
  absentDays: z.number().finite().nonnegative(),
  paidLeaveDays: z.number().finite().nonnegative(),
  unpaidLeaveDays: z.number().finite().nonnegative(),
  overtimeHours: z.number().finite().nonnegative(),
  lateEntries: z.number().finite().nonnegative(),
});

const leaveSummarySchema = z.object({
  totalLeaves: z.number().finite().nonnegative(),
  paidLeaves: z.number().finite().nonnegative(),
  unpaidLeaves: z.number().finite().nonnegative(),
  leaveWithoutPayDays: z.number().finite().nonnegative(),
});

export const createPayrollSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  month: payrollMonthSchema,
  year: z.number().int().min(2000).max(2100),
  status: payrollStatusSchema.optional().default("DRAFT"),
  payPeriodStart: z.string().min(1, "Pay period start is required"),
  payPeriodEnd: z.string().min(1, "Pay period end is required"),
  basicSalary: z.number().finite().positive("Basic salary must be greater than 0"),
  totalAllowances: z.number().finite().nonnegative().optional(),
  totalDeductions: z.number().finite().nonnegative().optional(),
  grossSalary: z.number().finite().nonnegative().optional(),
  netSalary: z.number().finite().nonnegative().optional(),
  taxableIncome: z.number().finite().nonnegative().optional(),
  allowances: z.array(allowanceSchema).optional(),
  deductions: z.array(deductionSchema).optional(),
  attendanceSummary: attendanceSummarySchema.optional(),
  leaveSummary: leaveSummarySchema.optional(),
  notes: z.string().max(2000).optional().nullable(),
});

export const updatePayrollSchema = z.object({
  status: payrollStatusSchema.optional(),
  payPeriodStart: z.string().min(1).optional(),
  payPeriodEnd: z.string().min(1).optional(),
  basicSalary: z.number().finite().positive().optional(),
  totalAllowances: z.number().finite().nonnegative().optional(),
  totalDeductions: z.number().finite().nonnegative().optional(),
  grossSalary: z.number().finite().nonnegative().optional(),
  netSalary: z.number().finite().nonnegative().optional(),
  taxableIncome: z.number().finite().nonnegative().optional(),
  allowances: z.array(allowanceSchema).optional(),
  deductions: z.array(deductionSchema).optional(),
  attendanceSummary: attendanceSummarySchema.optional(),
  leaveSummary: leaveSummarySchema.optional(),
  notes: z.string().max(2000).optional().nullable(),
});

export type CreatePayrollInput = z.infer<typeof createPayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;
