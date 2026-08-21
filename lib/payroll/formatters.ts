import type { PayrollMonth } from "@/types/payroll";

/** Indian Rupee formatting for all Payroll UI. */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonthName(month: PayrollMonth | string): string {
  const s = String(month);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const MONTH_TO_INDEX: Record<string, number> = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
};

export function monthToNumber(month: string): number {
  return (MONTH_TO_INDEX[month] ?? 0) + 1;
}

export function monthCode(month: string): string {
  return String(monthToNumber(month)).padStart(2, "0");
}

/** Inclusive calendar bounds for a payroll month/year (UTC date-only). */
export function payPeriodBounds(
  month: string,
  year: number
): { startIso: string; endIso: string } {
  const monthIndex = MONTH_TO_INDEX[month] ?? 0;
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(lastDay).padStart(2, "0");
  return {
    startIso: `${year}-${mm}-01`,
    endIso: `${year}-${mm}-${dd}`,
  };
}
