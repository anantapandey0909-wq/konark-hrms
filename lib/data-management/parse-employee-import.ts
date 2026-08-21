/**
 * Client-side CSV parsing / header normalization for Employee Import.
 * Does not write to the database — server re-validates all rows.
 */

import {
  employeeImportRowSchema,
  EMPLOYEE_IMPORT_MAX_ROWS,
  type EmployeeImportRowInput,
  type EmployeeImportRowError,
} from "@/lib/validation/employee-import";

export interface ParsedEmployeeImportRow {
  rowNumber: number;
  raw: Record<string, string>;
  data?: EmployeeImportRowInput;
  status: "valid" | "invalid";
  errors: EmployeeImportRowError[];
}

const HEADER_ALIASES: Record<string, keyof Omit<EmployeeImportRowInput, "rowNumber">> = {
  employeeid: "employeeId",
  "employee id": "employeeId",
  employee_id: "employeeId",
  employeecode: "employeeId",
  "employee code": "employeeId",
  firstname: "firstName",
  "first name": "firstName",
  first_name: "firstName",
  lastname: "lastName",
  "last name": "lastName",
  last_name: "lastName",
  email: "email",
  phone: "phone",
  mobilenumber: "phone",
  department: "department",
  departmentname: "department",
  "department name": "department",
  departmentcode: "department",
  "department code": "department",
  designation: "designation",
  jobtitle: "designation",
  "job title": "designation",
  employmenttype: "employmentType",
  "employment type": "employmentType",
  employment_type: "employmentType",
  status: "status",
  joiningdate: "joiningDate",
  "joining date": "joiningDate",
  joining_date: "joiningDate",
  datejoined: "joiningDate",
  "date joined": "joiningDate",
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

function normalizeEmploymentType(v: string): string {
  const s = v.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (["FULL_TIME", "FULLTIME", "FT"].includes(s)) return "FULL_TIME";
  if (["PART_TIME", "PARTTIME", "PT"].includes(s)) return "PART_TIME";
  if (["CONTRACT", "CONTRACTOR"].includes(s)) return "CONTRACT";
  if (["INTERN", "INTERNSHIP"].includes(s)) return "INTERN";
  return s;
}

function normalizeStatus(v: string): string {
  const s = v.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (s === "RESIGNED") return "INACTIVE";
  return s || "ACTIVE";
}

function normalizeDate(v: string): string {
  const t = v.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const m = t.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    return `${m[3]}-${mm}-${dd}`;
  }
  return t;
}

export function parseEmployeeImportCsv(text: string): {
  rows: ParsedEmployeeImportRow[];
  parseError?: string;
} {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return {
      rows: [],
      parseError: "File must include a header row and at least one data row.",
    };
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const fieldMap: (keyof Omit<EmployeeImportRowInput, "rowNumber"> | null)[] =
    headers.map((h) => HEADER_ALIASES[h] ?? null);

  if (!fieldMap.includes("employeeId") || !fieldMap.includes("email")) {
    return {
      rows: [],
      parseError:
        "CSV must include employeeId (or Employee ID) and email columns.",
    };
  }

  const dataLines = lines.slice(1);
  if (dataLines.length > EMPLOYEE_IMPORT_MAX_ROWS) {
    return {
      rows: [],
      parseError: `Import is limited to ${EMPLOYEE_IMPORT_MAX_ROWS} rows.`,
    };
  }

  const rows: ParsedEmployeeImportRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const rowNumber = i + 2; // 1-based file line (header is line 1)
    const cells = parseCsvLine(dataLines[i]);
    const raw: Record<string, string> = {};
    const candidate: Record<string, string> = {};

    fieldMap.forEach((field, idx) => {
      const value = cells[idx] ?? "";
      if (field) {
        raw[field] = value;
        candidate[field] = value;
      }
    });

    if (candidate.employmentType) {
      candidate.employmentType = normalizeEmploymentType(
        candidate.employmentType
      );
    }
    if (candidate.status) {
      candidate.status = normalizeStatus(candidate.status);
    } else {
      candidate.status = "ACTIVE";
    }
    if (candidate.joiningDate) {
      candidate.joiningDate = normalizeDate(candidate.joiningDate);
    }

    const result = employeeImportRowSchema.safeParse({
      rowNumber,
      ...candidate,
    });

    if (result.success) {
      rows.push({
        rowNumber,
        raw,
        data: result.data,
        status: "valid",
        errors: [],
      });
    } else {
      const errors: EmployeeImportRowError[] = result.error.issues.map(
        (issue) => ({
          rowNumber,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })
      );
      rows.push({
        rowNumber,
        raw,
        status: "invalid",
        errors,
      });
    }
  }

  return { rows };
}

export const EMPLOYEE_IMPORT_TEMPLATE_CSV = [
  "employeeId,firstName,lastName,email,phone,department,designation,employmentType,status,joiningDate",
  "EMP-9001,Asha,Verma,asha.verma@example.com,9876543210,Human Resources,HR Executive,FULL_TIME,ACTIVE,2026-01-15",
  "EMP-9002,Rohan,Mehta,rohan.mehta@example.com,9876543211,Engineering,Software Engineer,FULL_TIME,ACTIVE,2026-02-01",
].join("\n");
