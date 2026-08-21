/**
 * Client-side CSV parsing / header normalization for Attendance Import.
 * Blank rows (all empty cells) are ignored — they must not become validation errors.
 * Server re-validates all rows before commit.
 */

import {
  attendanceImportRowSchema,
  ATTENDANCE_IMPORT_MAX_ROWS,
  type AttendanceImportRowInput,
  type AttendanceImportRowError,
} from "@/lib/validation/attendance-import";
import { computeHours } from "@/lib/mappers/attendance.mapper";

export interface ParsedAttendanceImportRow {
  rowNumber: number;
  raw: Record<string, string>;
  data?: AttendanceImportRowInput;
  status: "valid" | "invalid";
  errors: AttendanceImportRowError[];
  /** Preview-only hours (server recalculates authoritatively). */
  previewHours: number | null;
}

const HEADER_ALIASES: Record<
  string,
  keyof Omit<AttendanceImportRowInput, "rowNumber">
> = {
  employeeid: "employeeId",
  "employee id": "employeeId",
  employee_id: "employeeId",
  employeecode: "employeeId",
  "employee code": "employeeId",
  attendancedate: "attendanceDate",
  "attendance date": "attendanceDate",
  attendance_date: "attendanceDate",
  date: "attendanceDate",
  checkin: "checkIn",
  "check in": "checkIn",
  check_in: "checkIn",
  checkout: "checkOut",
  "check out": "checkOut",
  check_out: "checkOut",
  breakduration: "breakDuration",
  "break duration": "breakDuration",
  break_duration: "breakDuration",
  status: "status",
  workmode: "workMode",
  "work mode": "workMode",
  work_mode: "workMode",
  location: "location",
  shiftname: "shiftName",
  "shift name": "shiftName",
  shift_name: "shiftName",
  remarks: "remarks",
  notes: "remarks",
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

function normalizeStatus(v: string): string {
  return v.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

function normalizeWorkMode(v: string): string {
  return v.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

function emptyToNull(v: string | undefined): string | null {
  if (v == null || !v.trim()) return null;
  return v.trim();
}

function previewTotalHours(
  date: string,
  checkIn: string | null,
  checkOut: string | null,
  breakDuration: number | null
): number | null {
  if (!checkIn || !checkOut || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const cin = new Date(`${date}T${checkIn}:00.000Z`);
  const cout = new Date(`${date}T${checkOut}:00.000Z`);
  if (Number.isNaN(cin.getTime()) || Number.isNaN(cout.getTime())) return null;
  return computeHours(cin, cout, breakDuration).totalHours;
}

export function parseAttendanceImportCsv(text: string): {
  rows: ParsedAttendanceImportRow[];
  parseError?: string;
  blankRowsSkipped: number;
} {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0 || l.includes(",")); // keep comma-only lines for blank detection

  // Re-split preserving empty lines that are only commas
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

  const headerLine = nonEmptyLines[0];
  const headers = parseCsvLine(headerLine).map(normalizeHeader);
  const fieldMap: (keyof Omit<AttendanceImportRowInput, "rowNumber"> | null)[] =
    headers.map((h) => HEADER_ALIASES[h] ?? null);

  if (!fieldMap.includes("employeeId") || !fieldMap.includes("attendanceDate")) {
    return {
      rows: [],
      parseError:
        "CSV must include employeeId and attendanceDate columns.",
      blankRowsSkipped: 0,
    };
  }

  const dataLines = nonEmptyLines.slice(1);
  let blankRowsSkipped = 0;
  const rows: ParsedAttendanceImportRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const fileLineNumber = i + 2; // header is line 1
    const cells = parseCsvLine(dataLines[i]);

    // Mandatory: ignore completely blank CSV rows
    if (isBlankRow(cells)) {
      blankRowsSkipped++;
      continue;
    }

    if (rows.length >= ATTENDANCE_IMPORT_MAX_ROWS) {
      return {
        rows: [],
        parseError: `Import is limited to ${ATTENDANCE_IMPORT_MAX_ROWS} rows.`,
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

    if (candidate.status) {
      candidate.status = normalizeStatus(candidate.status);
    }
    if (candidate.workMode) {
      candidate.workMode = normalizeWorkMode(candidate.workMode);
    }

    const result = attendanceImportRowSchema.safeParse({
      rowNumber: fileLineNumber,
      employeeId: candidate.employeeId,
      attendanceDate: candidate.attendanceDate,
      checkIn: emptyToNull(candidate.checkIn),
      checkOut: emptyToNull(candidate.checkOut),
      breakDuration:
        candidate.breakDuration != null && candidate.breakDuration.trim() !== ""
          ? candidate.breakDuration
          : null,
      status: candidate.status,
      workMode: candidate.workMode,
      location: emptyToNull(candidate.location),
      shiftName: emptyToNull(candidate.shiftName),
      remarks: emptyToNull(candidate.remarks),
    });

    if (result.success) {
      const d = result.data;
      const cin = d.checkIn?.trim() || null;
      const cout = d.checkOut?.trim() || null;
      const br =
        d.breakDuration != null && !Number.isNaN(Number(d.breakDuration))
          ? Number(d.breakDuration)
          : null;
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        data: d,
        status: "valid",
        errors: [],
        previewHours: previewTotalHours(d.attendanceDate, cin, cout, br),
      });
    } else {
      const errors: AttendanceImportRowError[] = result.error.issues.map(
        (issue) => ({
          rowNumber: fileLineNumber,
          employeeId: candidate.employeeId || undefined,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })
      );
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        status: "invalid",
        errors,
        previewHours: null,
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

export const ATTENDANCE_IMPORT_TEMPLATE_CSV = [
  "employeeId,attendanceDate,checkIn,checkOut,breakDuration,status,workMode,location,shiftName,remarks",
  "EMP-0001,2026-08-21,09:00,18:00,60,PRESENT,OFFICE,Main Office,General Shift,",
  "EMP-0002,2026-08-21,09:15,17:45,30,LATE,HYBRID,Home,General Shift,Traffic delay",
].join("\n");
