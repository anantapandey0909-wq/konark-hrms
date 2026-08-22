/**
 * Shared default allowance/deduction resolution used by payroll create and import.
 * Extracted so import can reuse the same arithmetic without duplicating rules.
 */

import {
  calculateGrossSalary,
  calculateNetSalary,
} from "@/lib/payroll";
import { monthCode } from "@/lib/payroll/formatters";
import type {
  PayrollAllowance,
  PayrollDeduction,
} from "@/types/payroll";

export function defaultAllowances(basic: number): PayrollAllowance[] {
  return [
    {
      id: "all-hra",
      name: "House Rent Allowance",
      amount: Math.round(basic * 0.4),
    },
    {
      id: "all-lta",
      name: "Leave Travel Allowance",
      amount: Math.round(basic * 0.1),
    },
    { id: "all-spl", name: "Special Allowance", amount: 500 },
  ];
}

export function defaultDeductions(basic: number): PayrollDeduction[] {
  return [
    {
      id: "ded-pf",
      name: "Provident Fund",
      amount: Math.round(basic * 0.12),
    },
    { id: "ded-tax", name: "Professional Tax", amount: 200 },
    { id: "ded-ins", name: "Health Insurance", amount: 150 },
  ];
}

function sumLineItems(items: readonly { amount: number }[]): number {
  return items.reduce((s, i) => s + i.amount, 0);
}

export function resolveSalaryComponents(
  basicSalary: number,
  options?: {
    allowances?: PayrollAllowance[];
    deductions?: PayrollDeduction[];
  }
): {
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  totalAllowances: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  taxableIncome: number;
} {
  const allowances =
    options?.allowances && options.allowances.length > 0
      ? options.allowances
      : defaultAllowances(basicSalary);
  const deductions =
    options?.deductions && options.deductions.length > 0
      ? options.deductions
      : defaultDeductions(basicSalary);

  const totalAllowances = sumLineItems(allowances);
  const totalDeductions = sumLineItems(deductions);
  const grossSalary = calculateGrossSalary(basicSalary, totalAllowances);
  const netSalary = calculateNetSalary(grossSalary, totalDeductions);
  const taxableIncome = Math.max(
    0,
    Math.round((grossSalary - totalDeductions) * 100) / 100
  );

  return {
    allowances,
    deductions,
    totalAllowances,
    totalDeductions,
    grossSalary,
    netSalary,
    taxableIncome,
  };
}

export function generatePayrollNumber(
  year: number,
  month: string,
  employeeCode: string
): string {
  const suffix =
    employeeCode.replace(/[^A-Za-z0-9]/g, "").slice(-6) || "000000";
  return `PAY-${year}-${monthCode(month)}-${suffix}-${Date.now().toString(36).toUpperCase()}`;
}
