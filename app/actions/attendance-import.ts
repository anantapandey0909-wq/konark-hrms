"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  importAttendance,
  previewAttendanceImport,
} from "@/lib/services/attendance-import.service";
import type {
  AttendanceImportBatchInput,
  AttendanceImportPreviewResult,
  AttendanceImportResult,
} from "@/lib/validation/attendance-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockPreview(
  input: AttendanceImportBatchInput
): AttendanceImportPreviewResult {
  const rows = input?.rows ?? [];
  return {
    totalRows: rows.length,
    validCount: rows.length,
    invalidCount: 0,
    duplicateCount: 0,
    canCommit: rows.length > 0,
    errors: [],
    validRowNumbers: rows.map((r) => r.rowNumber),
  };
}

export async function previewAttendanceImportAction(
  input: AttendanceImportBatchInput
): Promise<ActionResult<AttendanceImportPreviewResult>> {
  const real = isRealDataEnabled();
  console.info(
    "[attendance-import] previewAttendanceImportAction dataSource=" +
      (real ? "postgres" : "mock") +
      " rows=" +
      (input?.rows?.length ?? 0)
  );

  if (!real) {
    if (!input?.rows?.length) {
      return {
        success: false,
        error: "At least one row is required.",
        code: "VALIDATION",
      };
    }
    return { success: true, data: mockPreview(input) };
  }

  try {
    const data = await previewAttendanceImport(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function importAttendanceAction(
  input: AttendanceImportBatchInput
): Promise<ActionResult<AttendanceImportResult>> {
  const real = isRealDataEnabled();
  console.info(
    "[attendance-import] importAttendanceAction dataSource=" +
      (real ? "postgres" : "mock") +
      " rows=" +
      (input?.rows?.length ?? 0)
  );

  if (!real) {
    const rows = input?.rows ?? [];
    return {
      success: true,
      data: {
        success: true,
        importedCount: rows.length,
        failedCount: 0,
        skippedCount: 0,
        totalRows: rows.length,
        errors: [],
        importedIds: rows.map((_, i) => "mock-att-" + (i + 1)),
      },
    };
  }

  try {
    const data = await importAttendance(input);
    // Only revalidate when something was actually written.
    if (data.success && data.importedCount > 0) {
      revalidatePath("/dashboard/attendance");
      revalidatePath("/dashboard/data-management/attendance-import");
    }
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
