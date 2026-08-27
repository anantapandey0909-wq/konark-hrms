import { z } from "zod";
import { leaveTypeSchema } from "@/lib/validation/leave";

/** Max rows accepted in a single leave import request. */
export const LEAVE_IMPORT_MAX_ROWS = 500;

const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

/**
 * One normalized import row after client header mapping.
 * employeeId is the human-readable employee code (e.g. EMP-0001).
 * leaveType must resolve to an existing Prisma LeaveType enum value.
 * Status is not imported — records are always created as PENDING.
 */
export const leaveImportRowSchema = z
  .object({
    rowNumber: z.number().int().positive(),
    employeeId: z.string().trim().min(1).max(50),
    leaveType: leaveTypeSchema,
    startDate: isoDateSchema,
    endDate: isoDateSchema,
    totalDays: z.coerce.number().positive().optional().nullable(),
    reason: z.string().trim().min(3).max(500),
    appliedOn: isoDateSchema,
  })
  .superRefine((row, ctx) => {
    if (row.endDate < row.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date cannot be before start date",
      });
    }
  });

export type LeaveImportRowInput = z.infer<typeof leaveImportRowSchema>;

export const leaveImportBatchSchema = z
  .object({
    rows: z
      .array(leaveImportRowSchema)
      .min(1, "At least one row is required")
      .max(
        LEAVE_IMPORT_MAX_ROWS,
        "Import is limited to " + LEAVE_IMPORT_MAX_ROWS + " rows"
      ),
  })
  .strict();

export type LeaveImportBatchInput = z.infer<typeof leaveImportBatchSchema>;

export interface LeaveImportRowError {
  rowNumber: number;
  employeeId?: string;
  field?: string;
  message: string;
}

export interface LeaveImportResult {
  success: boolean;
  importedCount: number;
  failedCount: number;
  skippedCount: number;
  totalRows: number;
  errors: LeaveImportRowError[];
  importedIds: string[];
}

/** Read-only server validation result (no mutations). */
export interface LeaveImportPreviewResult {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  canCommit: boolean;
  errors: LeaveImportRowError[];
  validRowNumbers: number[];
}
