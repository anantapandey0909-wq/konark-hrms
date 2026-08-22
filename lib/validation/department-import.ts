import { z } from "zod";

/** Max rows accepted in a single department import request. */
export const DEPARTMENT_IMPORT_MAX_ROWS = 100;

export const departmentStatusImportSchema = z.enum(["ACTIVE", "INACTIVE"]);

/**
 * One normalized import row after client header mapping.
 * departmentCode is globally unique in the current Prisma schema.
 */
export const departmentImportRowSchema = z.object({
  rowNumber: z.number().int().positive(),
  departmentCode: z
    .string()
    .trim()
    .min(2, "Department code must be at least 2 characters")
    .max(20, "Department code cannot exceed 20 characters")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Code must contain only letters, numbers, and hyphens"
    ),
  departmentName: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(100),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .or(z.literal("")),
  status: departmentStatusImportSchema,
});

export type DepartmentImportRowInput = z.infer<
  typeof departmentImportRowSchema
>;

export const departmentImportBatchSchema = z
  .object({
    rows: z
      .array(departmentImportRowSchema)
      .min(1, "At least one row is required")
      .max(
        DEPARTMENT_IMPORT_MAX_ROWS,
        `Import is limited to ${DEPARTMENT_IMPORT_MAX_ROWS} rows`
      ),
  })
  .strict();

export type DepartmentImportBatchInput = z.infer<
  typeof departmentImportBatchSchema
>;

export interface DepartmentImportRowError {
  rowNumber: number;
  departmentCode?: string;
  field?: string;
  message: string;
}

export interface DepartmentImportResult {
  success: boolean;
  importedCount: number;
  failedCount: number;
  skippedCount: number;
  totalRows: number;
  errors: DepartmentImportRowError[];
  importedIds: string[];
}
