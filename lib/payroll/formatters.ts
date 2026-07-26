import { PayrollMonth } from "@/types/payroll";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonthName(month: PayrollMonth): string {
  return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
}