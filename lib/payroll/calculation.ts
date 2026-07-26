import { PayrollAllowance, PayrollDeduction } from "@/types/payroll";

export function calculateGrossSalary(basicSalary: number, allowances: readonly PayrollAllowance[]): number {
  return basicSalary + allowances.reduce((acc, current) => acc + current.amount, 0);
}

export function calculateNetSalary(grossSalary: number, deductions: readonly PayrollDeduction[]): number {
  return grossSalary - deductions.reduce((acc, current) => acc + current.amount, 0);
}