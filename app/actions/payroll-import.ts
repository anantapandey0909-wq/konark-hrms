"use server";

import { revalidatePath } from "next/cache";
import { requireCanImportPayroll } from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  importPayrollRecords,
  previewPayrollImport,
} from "@/lib/services/payroll-import.service";
import type {
  PayrollImportBatchInput,
  PayrollImportPreviewResult,
  PayrollImportResult,
} from "@/lib/validation/payroll-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockPreview(
  input: PayrollImportBatchInput
): PayrollImportPreviewResult {
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

export async function previewPayrollImportAction(
  input: PayrollImportBatchInput
): Promise<ActionResult<PayrollImportPreviewResult>> {
  try {
    await requireCanImportPayroll();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const real = isRealDataEnabled();
  console.info(
    "[payroll-import] previewPayrollImportAction dataSource=" +
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
    const data = await previewPayrollImport(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function importPayrollRecordsAction(
  input: PayrollImportBatchInput
): Promise<ActionResult<PayrollImportResult>> {
  try {
    await requireCanImportPayroll();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const real = isRealDataEnabled();
  console.info(
    "[payroll-import] importPayrollRecordsAction dataSource=" +
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
        importedIds: rows.map((_, i) => "mock-pay-" + (i + 1)),
      },
    };
  }

  try {
    const data = await importPayrollRecords(input);
    if (data.success && data.importedCount > 0) {
      revalidatePath("/dashboard/payroll");
      revalidatePath("/dashboard/data-management/payroll-import");
    }
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
