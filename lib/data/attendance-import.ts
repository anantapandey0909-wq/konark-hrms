/**
 * Thin attendance-import adapter.
 * Mock vs real is decided inside app/actions/attendance-import.ts.
 */

import {
  importAttendanceAction,
  previewAttendanceImportAction,
} from "@/app/actions/attendance-import";
import type {
  AttendanceImportBatchInput,
  AttendanceImportPreviewResult,
  AttendanceImportResult,
} from "@/lib/validation/attendance-import";

export async function previewAttendanceImportBatch(
  input: AttendanceImportBatchInput
): Promise<AttendanceImportPreviewResult> {
  const result = await previewAttendanceImportAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function executeAttendanceImport(
  input: AttendanceImportBatchInput
): Promise<AttendanceImportResult> {
  const result = await importAttendanceAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
