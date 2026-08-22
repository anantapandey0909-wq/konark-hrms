"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import { importDepartments } from "@/lib/services/department-import.service";
import type {
  DepartmentImportBatchInput,
  DepartmentImportResult,
} from "@/lib/validation/department-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export async function importDepartmentsAction(
  input: DepartmentImportBatchInput
): Promise<ActionResult<DepartmentImportResult>> {
  const real = isRealDataEnabled();
  console.info(
    `[department-import] importDepartmentsAction dataSource=${real ? "postgres" : "mock"} rows=${input?.rows?.length ?? 0}`
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
        importedIds: rows.map((_, i) => `mock-dept-${i + 1}`),
      },
    };
  }

  try {
    const data = await importDepartments(input);
    revalidatePath("/dashboard/departments");
    revalidatePath("/dashboard/data-management/master-data");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
