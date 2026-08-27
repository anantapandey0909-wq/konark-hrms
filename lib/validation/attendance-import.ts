import { z } from "zod";
import {
  attendanceStatusSchema,
  workModeSchema,
} from "@/lib/validation/attendance";

/** Max rows accepted in a single attendance import request. */
export const ATTENDANCE_IMPORT_MAX_ROWS = 500;

const hhmmSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:mm (24-hour)");

/**
 * One normalized import row after client header mapping.
 * employeeId is the human-readable employee code (e.g. EMP-0001).
 */
export const attendanceImportRowSchema = z
  .object({
    rowNumber: z.number().int().positive(),
    employeeId: z.string().trim().min(1).max(50),
    attendanceDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "attendanceDate must be YYYY-MM-DD"),
    checkIn: hhmmSchema.optional().nullable().or(z.literal("")),
    checkOut: hhmmSchema.optional().nullable().or(z.literal("")),
    breakDuration: z.coerce.number().int().min(0).optional().nullable(),
    status: attendanceStatusSchema,
    workMode: workModeSchema,
    location: z.string().trim().max(200).optional().nullable().or(z.literal("")),
    shiftName: z.string().trim().max(100).optional().nullable().or(z.literal("")),
    remarks: z.string().trim().max(500).optional().nullable().or(z.literal("")),
  })
  .superRefine((row, ctx) => {
    const cin = row.checkIn?.trim() || null;
    const cout = row.checkOut?.trim() || null;
    if (cin && cout && cout < cin) {
      // Lexicographic works for HH:mm in 24h format
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out cannot precede check-in.",
      });
    }
  });

export type AttendanceImportRowInput = z.infer<
  typeof attendanceImportRowSchema
>;

export const attendanceImportBatchSchema = z
  .object({
    rows: z
      .array(attendanceImportRowSchema)
      .min(1, "At least one row is required")
      .max(
        ATTENDANCE_IMPORT_MAX_ROWS,
        `Import is limited to ${ATTENDANCE_IMPORT_MAX_ROWS} rows`
      ),
  })
  .strict();

export type AttendanceImportBatchInput = z.infer<
  typeof attendanceImportBatchSchema
>;

export interface AttendanceImportRowError {
  rowNumber: number;
  employeeId?: string;
  field?: string;
  message: string;
}

export interface AttendanceImportResult {
  success: boolean;
  importedCount: number;
  failedCount: number;
  skippedCount: number;
  totalRows: number;
  errors: AttendanceImportRowError[];
  importedIds: string[];
}

/** Read-only server validation result (no mutations). */
export interface AttendanceImportPreviewResult {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  canCommit: boolean;
  errors: AttendanceImportRowError[];
  validRowNumbers: number[];
}
