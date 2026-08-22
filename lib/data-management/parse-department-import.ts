/**
 * Client-side CSV parsing for Department Master Data Import.
 * Blank rows are ignored. Server re-validates all rows before commit.
 */

import {
  departmentImportRowSchema,
  DEPARTMENT_IMPORT_MAX_ROWS,
  type DepartmentImportRowInput,
  type DepartmentImportRowError,
} from "@/lib/validation/department-import";

export interface ParsedDepartmentImportRow {
  rowNumber: number;
  raw: Record<string, string>;
  data?: DepartmentImportRowInput;
  status: "valid" | "invalid";
  errors: DepartmentImportRowError[];
}

const HEADER_ALIASES: Record<
  string,
  keyof Omit<DepartmentImportRowInput, "rowNumber">
> = {
  departmentcode: "departmentCode",
  "department code": "departmentCode",
  department_code: "departmentCode",
  code: "departmentCode",
  deptid: "departmentCode",
  "dept id": "departmentCode",
  departmentname: "departmentName",
  "department name": "departmentName",
  department_name: "departmentName",
  name: "departmentName",
  description: "description",
  desc: "description",
  status: "status",
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

function normalizeStatus(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

export function parseDepartmentImportCsv(text: string): {
  rows: ParsedDepartmentImportRow[];
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
  const fieldMap: (keyof Omit<DepartmentImportRowInput, "rowNumber"> | null)[] =
    headers.map((h) => HEADER_ALIASES[h] ?? null);

  if (
    !fieldMap.includes("departmentCode") ||
    !fieldMap.includes("departmentName") ||
    !fieldMap.includes("status")
  ) {
    return {
      rows: [],
      parseError:
        "CSV must include departmentCode, departmentName, and status columns.",
      blankRowsSkipped: 0,
    };
  }

  const dataLines = nonEmptyLines.slice(1);
  let blankRowsSkipped = 0;
  const rows: ParsedDepartmentImportRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const fileLineNumber = i + 2;
    const cells = parseCsvLine(dataLines[i]);

    if (isBlankRow(cells)) {
      blankRowsSkipped++;
      continue;
    }

    if (rows.length >= DEPARTMENT_IMPORT_MAX_ROWS) {
      return {
        rows: [],
        parseError: `Import is limited to ${DEPARTMENT_IMPORT_MAX_ROWS} rows.`,
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

    const result = departmentImportRowSchema.safeParse({
      rowNumber: fileLineNumber,
      departmentCode: candidate.departmentCode,
      departmentName: candidate.departmentName,
      description:
        candidate.description != null && candidate.description.trim() !== ""
          ? candidate.description.trim()
          : null,
      status: candidate.status,
    });

    if (result.success) {
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        data: result.data,
        status: "valid",
        errors: [],
      });
    } else {
      const errors: DepartmentImportRowError[] = result.error.issues.map(
        (issue) => ({
          rowNumber: fileLineNumber,
          departmentCode: candidate.departmentCode || undefined,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })
      );
      rows.push({
        rowNumber: fileLineNumber,
        raw,
        status: "invalid",
        errors,
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
export const DEPARTMENT_IMPORT_TEMPLATE_CSV =
  "departmentCode,departmentName,description,status\n";
