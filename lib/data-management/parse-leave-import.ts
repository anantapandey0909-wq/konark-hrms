/**
 * Client-side CSV parsing for Leave Import.
 * Blank rows are ignored. Dates must be YYYY-MM-DD (no DD-MM-YYYY).
 * Server re-validates all rows before commit.
 */

import {
  leaveImportRowSchema,
  LEAVE_IMPORT_MAX_ROWS,
  type LeaveImportRowInput,
  type LeaveImportRowError,
} from "@/lib/validation/leave-import";
import { calculateLeaveDays } from "@/lib/mappers/leave.mapper";

export interface ParsedLeaveImportRow {
  rowNumber: number;
  raw: Record<string, string>;
  data?: LeaveImportRowInput;
  status: "valid" | "invalid";
  errors: LeaveImportRowError[];
  /** Server recalculates; preview uses the same helper. */
  previewTotalDays: number | null;
}

const HEADER_ALIASES: Record<
  string,
  keyof Omit<LeaveImportRowInput, "rowNumber">
> = {
  employeeid: "employeeId",
  "employee id": "employeeId",
  employee_id: "employeeId",
  employeecode: "employeeId",
  "employee code": "employeeId",
  leavetype: "leaveType",
  "leave type": "leaveType",
  leave_type: "leaveType",
  type: "leaveType",
  startdate: "startDate",
  "start date": "startDate",
  start_date: "startDate",
  enddate: "endDate",
  "end date": "endDate",
  end_date: "endDate",
  totaldays: "totalDays",
  "total days": "totalDays",
  total_days: "totalDays",
  days: "totalDays",
  reason: "reason",
  appliedon: "appliedOn",
  "applied on": "appliedOn",
  applied_on: "appliedOn",
};

/** Map friendly CSV labels to existing Prisma LeaveType enum only. */
const LEAVE_TYPE_ALIASES: Record<string, string> = {
  CASUAL_LEAVE: "CASUAL_LEAVE",
  CASUAL: "CASUAL_LEAVE",
  "CASUAL LEAVE": "CASUAL_LEAVE",
  SICK_LEAVE: "SICK_LEAVE",
  SICK: "SICK_LEAVE",
  "SICK LEAVE": "SICK_LEAVE",
  EARNED_LEAVE: "EARNED_LEAVE",
  EARNED: "EARNED_LEAVE",
  "EARNED LEAVE": "EARNED_LEAVE",
  ANNUAL: "EARNED_LEAVE",
  "ANNUAL LEAVE": "EARNED_LEAVE",
  MATERNITY_LEAVE: "MATERNITY_LEAVE",
  MATERNITY: "MATERNITY_LEAVE",
  "MATERNITY LEAVE": "MATERNITY_LEAVE",
  PATERNITY_LEAVE: "PATERNITY_LEAVE",
  PATERNITY: "PATERNITY_LEAVE",
  "PATERNITY LEAVE": "PATERNITY_LEAVE",
  WORK_FROM_HOME: "WORK_FROM_HOME",
  WFH: "WORK_FROM_HOME",
  "WORK FROM HOME": "WORK_FROM_HOME",
  HALF_DAY: "HALF_DAY",
  "HALF DAY": "HALF_DAY",
  COMP_OFF: "COMP_OFF",
  "COMP OFF": "COMP_OFF",
  COMPENSATORY: "COMP_OFF",
};

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

function mapLeaveType(raw: string): string | null {
  const key = raw.trim().toUpperCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  const underscored = raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return (
    LEAVE_TYPE_ALIASES[key] ??
    LEAVE_TYPE_ALIASES[underscored] ??
    LEAVE_TYPE_ALIASES[raw.trim().toUpperCase()] ??
    null
  );
}

export function parseLeaveImportCsv(text: string): {
  rows: ParsedLeaveImportRow[];
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
  const fieldMap: (keyof Omit<LeaveImportRowInput, "rowNumber"> | null)[] =
    headers.map((h) => HEADER_ALIASES[h] ?? null);

  if (
    !fieldMap.includes("employeeId") ||
    !fieldMap.includes("leaveType") ||
    !fieldMap.includes("startDate") ||
    !fieldMap.includes("endDate")
  ) {
    return {
      rows: [],
      parseError:
        "CSV must include employeeId, leaveType, startDate, and endDate columns.",
      blankRowsSkipped: 0,
    };
  }

  const dataLines = nonEmptyLines.slice(1);
  let blankRowsSkipped = 0;
  const rows: ParsedLeaveImportRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const fileLineNumber = i + 2;
    const cells = parseCsvLine(dataLines[i]);

    if (isBlankRow(cells)) {
      blankRowsSkipped++;
      continue;
    }

    if (rows.length >= LEAVE_IMPORT_MAX_ROWS) {
      return {
        rows: [],
        parseError: `Import is limited to ${LEAVE_IMPORT_MAX_ROWS} rows.`,
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

    const mappedType = candidate.leaveType
      ? mapLeaveType(candidate.leaveType)
      : null;

    const result = leaveImportRowSchema.safeParse({
      rowNumber: fileLineNumber,
      employeeId: candidate.employeeId,
      leaveType: mappedType ?? candidate.leaveType,
      startDate: candidate.startDate,
      endDate: candidate.endDate,
      totalDays:
        candidate.totalDays != null && candidate.totalDays.trim() !== ""
          ? candidate.totalDays
          : null,
      reason: candidate.reason,
      appliedOn: candidate.appliedOn,
    });

    if (result.success) {
      const d = result.data;
      const start = new Date(`${d.startDate}T00:00:00.000Z`);
      const end = new Date(`${d.endDate}T00:00:00.000Z`);
      const calc = calculateLeaveDays(
        start,
        end,
        d.leaveType,
        d.leaveType === "HALF_DAY"
      );
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        data: d,
        status: "valid",
        errors: [],
        previewTotalDays: calc,
      });
    } else {
      const errors: LeaveImportRowError[] = result.error.issues.map(
        (issue) => ({
          rowNumber: fileLineNumber,
          employeeId: candidate.employeeId || undefined,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })
      );
      if (candidate.leaveType && !mappedType) {
        errors.unshift({
          rowNumber: fileLineNumber,
          employeeId: candidate.employeeId || undefined,
          field: "leaveType",
          message: `Unknown leave type "${candidate.leaveType}". Use a supported LeaveType enum value.`,
        });
      }
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        status: "invalid",
        errors,
        previewTotalDays: null,
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

/** Header-only template to avoid accidental production imports of sample data. */
export const LEAVE_IMPORT_TEMPLATE_CSV =
  "employeeId,leaveType,startDate,endDate,totalDays,reason,appliedOn\n";
