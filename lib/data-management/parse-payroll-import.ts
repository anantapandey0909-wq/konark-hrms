/**
 * Client-side CSV parsing for Payroll Import.
 * Does not calculate authoritative salary totals or write to the database.
 * Blank rows are ignored. Month is normalized case-insensitively.
 */

import {
  payrollImportRowSchema,
  PAYROLL_IMPORT_MAX_ROWS,
  type PayrollImportRowInput,
  type PayrollImportRowError,
} from "@/lib/validation/payroll-import";
import {
  calculateGrossSalary,
  calculateNetSalary,
} from "@/lib/payroll";

export interface ParsedPayrollImportRow {
  rowNumber: number;
  raw: Record<string, string>;
  data?: PayrollImportRowInput;
  status: "valid" | "invalid";
  errors: PayrollImportRowError[];
  /** Preview-only estimates using default allowance/deduction ratios (server recalculates). */
  previewGross: number | null;
  previewNet: number | null;
}

const HEADER_ALIASES: Record<
  string,
  keyof Omit<PayrollImportRowInput, "rowNumber">
> = {
  employeeid: "employeeId",
  "employee id": "employeeId",
  employee_id: "employeeId",
  employeecode: "employeeId",
  "employee code": "employeeId",
  month: "month",
  payrollmonth: "month",
  "payroll month": "month",
  year: "year",
  payrollyear: "year",
  "payroll year": "year",
  basicsalary: "basicSalary",
  "basic salary": "basicSalary",
  basic_salary: "basicSalary",
  basic: "basicSalary",
  notes: "notes",
  remarks: "notes",
};

const VALID_MONTHS = new Set([
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

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function isBlankRow(cells: string[]): boolean {
  return cells.every((c) => !c || !c.trim());
}

function normalizeMonth(raw: string): string | null {
  const m = raw.trim().toUpperCase().replace(/[\s-]+/g, "");
  // Accept JANUARY or Jan etc. via full names only
  const full = raw.trim().toUpperCase();
  if (VALID_MONTHS.has(full)) return full;
  // Map common short forms
  const shorts: Record<string, string> = {
    JAN: "JANUARY",
    FEB: "FEBRUARY",
    MAR: "MARCH",
    APR: "APRIL",
    MAY: "MAY",
    JUN: "JUNE",
    JUL: "JULY",
    AUG: "AUGUST",
    SEP: "SEPTEMBER",
    SEPT: "SEPTEMBER",
    OCT: "OCTOBER",
    NOV: "NOVEMBER",
    DEC: "DECEMBER",
  };
  if (shorts[m]) return shorts[m];
  if (VALID_MONTHS.has(m)) return m;
  return null;
}

/** Preview estimates matching default allowance/deduction ratios in payroll.service. */
function previewSalary(basic: number): { gross: number; net: number } {
  const totalAllowances =
    Math.round(basic * 0.4) + Math.round(basic * 0.1) + 500;
  const totalDeductions = Math.round(basic * 0.12) + 200 + 150;
  const gross = calculateGrossSalary(basic, totalAllowances);
  const net = calculateNetSalary(gross, totalDeductions);
  return { gross, net };
}

export function parsePayrollImportCsv(text: string): {
  rows: ParsedPayrollImportRow[];
  parseError?: string;
  blankRowsSkipped: number;
} {
  const allLines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd());

  const nonEmptyLines = allLines.filter((l) => l.trim().length > 0);
  if (nonEmptyLines.length < 1) {
    return {
      rows: [],
      parseError: "File must include a header row.",
      blankRowsSkipped: 0,
    };
  }

  const headers = parseCsvLine(nonEmptyLines[0]).map(normalizeHeader);
  const fieldMap: (keyof Omit<PayrollImportRowInput, "rowNumber"> | null)[] =
    headers.map((h) => HEADER_ALIASES[h] ?? null);

  if (
    !fieldMap.includes("employeeId") ||
    !fieldMap.includes("month") ||
    !fieldMap.includes("year") ||
    !fieldMap.includes("basicSalary")
  ) {
    return {
      rows: [],
      parseError:
        "CSV must include employeeId, month, year, and basicSalary columns.",
      blankRowsSkipped: 0,
    };
  }

  const dataLines = nonEmptyLines.slice(1);
  let blankRowsSkipped = 0;
  const rows: ParsedPayrollImportRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const fileLineNumber = i + 2;
    const cells = parseCsvLine(dataLines[i]);

    if (isBlankRow(cells)) {
      blankRowsSkipped++;
      continue;
    }

    if (rows.length >= PAYROLL_IMPORT_MAX_ROWS) {
      return {
        rows: [],
        parseError: `Import is limited to ${PAYROLL_IMPORT_MAX_ROWS} rows.`,
        blankRowsSkipped,
      };
    }

    const raw: Record<string, string> = {};
    const candidate: Record<string, string> = {};

    fieldMap.forEach((field, idx) => {
      const value = cells[idx] ?? "";
      if (field) {
        raw[field] = value;
        candidate[field] = value;
      }
    });

    const normalizedMonth = candidate.month
      ? normalizeMonth(candidate.month)
      : null;

    const result = payrollImportRowSchema.safeParse({
      rowNumber: fileLineNumber,
      employeeId: candidate.employeeId,
      month: normalizedMonth ?? candidate.month,
      year: candidate.year,
      basicSalary: candidate.basicSalary,
      notes:
        candidate.notes != null && candidate.notes.trim() !== ""
          ? candidate.notes.trim()
          : null,
    });

    if (result.success) {
      const preview = previewSalary(result.data.basicSalary);
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        data: result.data,
        status: "valid",
        errors: [],
        previewGross: preview.gross,
        previewNet: preview.net,
      });
    } else {
      const errors: PayrollImportRowError[] = result.error.issues.map(
        (issue) => ({
          rowNumber: fileLineNumber,
          employeeId: candidate.employeeId || undefined,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })
      );
      if (candidate.month && !normalizedMonth) {
        errors.unshift({
          rowNumber: fileLineNumber,
          employeeId: candidate.employeeId || undefined,
          field: "month",
          message: `Invalid month "${candidate.month}". Use JANUARY–DECEMBER.`,
        });
      }
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        status: "invalid",
        errors,
        previewGross: null,
        previewNet: null,
      });
    }
  }

  if (rows.length === 0 && blankRowsSkipped > 0) {
    return {
      rows: [],
      parseError: "File contains only blank rows after the header.",
      blankRowsSkipped,
    };
  }

  if (rows.length === 0) {
    return {
      rows: [],
      parseError: "File must include at least one data row.",
      blankRowsSkipped,
    };
  }

  return { rows, blankRowsSkipped };
}

/** Header-only template — avoids accidental import of sample data. */
export const PAYROLL_IMPORT_TEMPLATE_CSV =
  "employeeId,month,year,basicSalary,notes\n";
