"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  importEmployees,
  previewEmployeeImport,
} from "@/lib/services/employee-import.service";
import type {
  EmployeeImportBatchInput,
  EmployeeImportPreviewResult,
  EmployeeImportResult,
} from "@/lib/validation/employee-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockPreview(
  input: EmployeeImportBatchInput
): EmployeeImportPreviewResult {
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

export async function previewEmployeeImportAction(
  input: EmployeeImportBatchInput
): Promise<ActionResult<EmployeeImportPreviewResult>> {
  const real = isRealDataEnabled();
  console.info(
    "[employee-import] previewEmployeeImportAction dataSource=" +
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
    const data = await previewEmployeeImport(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function importEmployeesAction(
  input: EmployeeImportBatchInput
): Promise<ActionResult<EmployeeImportResult>> {
  const real = isRealDataEnabled();
  console.info(
    "[employee-import] importEmployeesAction dataSource=" +
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
        totalRows: rows.length,
        errors: [],
        importedEmployeeIds: rows.map((_, i) => "mock-emp-" + (i + 1)),
      },
    };
  }

  try {
    const data = await importEmployees(input);
    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/data-management/employee-import");
    revalidatePath("/dashboard/data-management/history");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
