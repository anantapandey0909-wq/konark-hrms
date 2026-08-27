import { z } from "zod";

/** Max rows accepted in a single import request. */
export const EMPLOYEE_IMPORT_MAX_ROWS = 500;

/**
 * One normalized import row after client header mapping.
 * department is name or code; server resolves to departmentId within the tenant.
 */
export const employeeImportRowSchema = z.object({
  rowNumber: z.number().int().positive(),
  employeeId: z.string().trim().min(1).max(50),
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional().nullable(),
  department: z.string().trim().min(1).max(120),
  designation: z.string().trim().min(1).max(120),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]),
  status: z
    .enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"])
    .default("ACTIVE"),
  joiningDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "joiningDate must be YYYY-MM-DD"),
});

export type EmployeeImportRowInput = z.infer<typeof employeeImportRowSchema>;

export const employeeImportBatchSchema = z
  .object({
    rows: z
      .array(employeeImportRowSchema)
      .min(1, "At least one row is required")
      .max(
        EMPLOYEE_IMPORT_MAX_ROWS,
        `Import is limited to ${EMPLOYEE_IMPORT_MAX_ROWS} rows`
      ),
  })
  .strict();

export type EmployeeImportBatchInput = z.infer<
  typeof employeeImportBatchSchema
>;

export interface EmployeeImportRowError {
  rowNumber: number;
  field?: string;
  message: string;
}

export interface EmployeeImportResult {
  success: boolean;
  importedCount: number;
  failedCount: number;
  totalRows: number;
  errors: EmployeeImportRowError[];
  importedEmployeeIds: string[];
}

/** Read-only server validation result (no mutations). */
export interface EmployeeImportPreviewResult {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  canCommit: boolean;
  errors: EmployeeImportRowError[];
  /** Row numbers that passed all server checks. */
  validRowNumbers: number[];
}
