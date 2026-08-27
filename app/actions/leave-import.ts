"use server";

import { revalidatePath } from "next/cache";
import { requireCanManageData } from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  importLeaveRequests,
  previewLeaveImport,
} from "@/lib/services/leave-import.service";
import type {
  LeaveImportBatchInput,
  LeaveImportPreviewResult,
  LeaveImportResult,
} from "@/lib/validation/leave-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockPreview(input: LeaveImportBatchInput): LeaveImportPreviewResult {
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

export async function previewLeaveImportAction(
  input: LeaveImportBatchInput
): Promise<ActionResult<LeaveImportPreviewResult>> {
  try {
    await requireCanManageData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const real = isRealDataEnabled();
  console.info(
    "[leave-import] previewLeaveImportAction dataSource=" +
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
    const data = await previewLeaveImport(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function importLeaveRequestsAction(
  input: LeaveImportBatchInput
): Promise<ActionResult<LeaveImportResult>> {
  try {
    await requireCanManageData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const real = isRealDataEnabled();
  console.info(
    "[leave-import] importLeaveRequestsAction dataSource=" +
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
        importedIds: rows.map((_, i) => "mock-leave-" + (i + 1)),
      },
    };
  }

  try {
    const data = await importLeaveRequests(input);
    revalidatePath("/dashboard/leave");
    revalidatePath("/dashboard/data-management/leave-import");
    revalidatePath("/dashboard/data-management/history");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
