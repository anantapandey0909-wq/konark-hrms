/**
 * Payroll-import repository helpers.
 * Duplicate checks reuse payroll.repository.findPayrollByEmployeePeriod.
 */

import type { Prisma, PayrollMonth } from "@prisma/client";

export async function createPayrollInTx(
  tx: Prisma.TransactionClient,
  data: {
    payrollNumber: string;
    month: PayrollMonth;
    year: number;
    payPeriodStart: Date;
    payPeriodEnd: Date;
    employeeCode: string;
    employeeName: string;
    designation: string;
    departmentName: string | null;
    basicSalary: number;
    grossSalary: number;
    netSalary: number;
    totalAllowances: number;
    totalDeductions: number;
    taxableIncome: number;
    allowances: Prisma.InputJsonValue;
    deductions: Prisma.InputJsonValue;
    attendanceSummary: Prisma.InputJsonValue;
    leaveSummary: Prisma.InputJsonValue;
    notes: string | null;
    companyId: string;
    employeeId: string;
  }
) {
  return tx.payroll.create({
    data: {
      payrollNumber: data.payrollNumber,
      month: data.month,
      year: data.year,
      status: "DRAFT",
      payPeriodStart: data.payPeriodStart,
      payPeriodEnd: data.payPeriodEnd,
      employeeCode: data.employeeCode,
      employeeName: data.employeeName,
      designation: data.designation,
      departmentName: data.departmentName,
      basicSalary: data.basicSalary,
      grossSalary: data.grossSalary,
      netSalary: data.netSalary,
      totalAllowances: data.totalAllowances,
      totalDeductions: data.totalDeductions,
      taxableIncome: data.taxableIncome,
      allowances: data.allowances,
      deductions: data.deductions,
      attendanceSummary: data.attendanceSummary,
      leaveSummary: data.leaveSummary,
      generatedAt: new Date(),
      paidAt: null,
      notes: data.notes,
      companyId: data.companyId,
      employeeId: data.employeeId,
    },
  });
}
