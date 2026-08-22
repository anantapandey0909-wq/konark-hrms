import { z } from "zod";
import { payrollMonthSchema } from "@/lib/validation/payroll";

/** Max rows accepted in a single payroll import request. */
export const PAYROLL_IMPORT_MAX_ROWS = 500;

/**
 * One normalized import row after client header mapping.
 * employeeId is the human-readable employee code (e.g. EMP-0001).
 * Status is always DRAFT on import — not accepted from CSV.
 */
export const payrollImportRowSchema = z.object({
  rowNumber: z.number().int().positive(),
  employeeId: z.string().trim().min(1).max(50),
  month: payrollMonthSchema,
  year: z.coerce.number().int().min(2000).max(2100),
  basicSalary: z.coerce
    .number()
    .finite()
    .positive("Basic salary must be greater than 0"),
  notes: z.string().trim().max(2000).optional().nullable().or(z.literal("")),
});

export type PayrollImportRowInput = z.infer<typeof payrollImportRowSchema>;

export const payrollImportBatchSchema = z
  .object({
    rows: z
      .array(payrollImportRowSchema)
      .min(1, "At least one row is required")
      .max(
        PAYROLL_IMPORT_MAX_ROWS,
        `Import is limited to ${PAYROLL_IMPORT_MAX_ROWS} rows`
      ),
  })
  .strict();

export type PayrollImportBatchInput = z.infer<
  typeof payrollImportBatchSchema
>;

export interface PayrollImportRowError {
  rowNumber: number;
  employeeId?: string;
  field?: string;
  message: string;
}

export interface PayrollImportResult {
  success: boolean;
  importedCount: number;
  failedCount: number;
  skippedCount: number;
  totalRows: number;
  errors: PayrollImportRowError[];
  importedIds: string[];
}
