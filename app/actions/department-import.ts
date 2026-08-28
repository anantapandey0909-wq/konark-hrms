"use server";

import { revalidatePath } from "next/cache";
import { requireCanImportDepartments } from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  importDepartments,
  previewDepartmentImport,
} from "@/lib/services/department-import.service";
import type {
  DepartmentImportBatchInput,
  DepartmentImportPreviewResult,
  DepartmentImportResult,
} from "@/lib/validation/department-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockPreview(
  input: DepartmentImportBatchInput
): DepartmentImportPreviewResult {
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

export async function previewDepartmentImportAction(
  input: DepartmentImportBatchInput
): Promise<ActionResult<DepartmentImportPreviewResult>> {
  try {
    await requireCanImportDepartments();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const real = isRealDataEnabled();
  console.info(
    "[department-import] previewDepartmentImportAction dataSource=" +
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
    const data = await previewDepartmentImport(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function importDepartmentsAction(
  input: DepartmentImportBatchInput
): Promise<ActionResult<DepartmentImportResult>> {
  try {
    await requireCanImportDepartments();
  } catch (error) {
    return toSafeActionResult(error);
  }

  const real = isRealDataEnabled();
  console.info(
    "[department-import] importDepartmentsAction dataSource=" +
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
        importedIds: rows.map((_, i) => "mock-dept-" + (i + 1)),
      },
    };
  }

  try {
    const data = await importDepartments(input);
    if (data.success && data.importedCount > 0) {
      revalidatePath("/dashboard/departments");
      revalidatePath("/dashboard/data-management/master-data");
    }
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
