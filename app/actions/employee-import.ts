"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import { importEmployees } from "@/lib/services/employee-import.service";
import type {
  EmployeeImportBatchInput,
  EmployeeImportResult,
} from "@/lib/validation/employee-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export async function importEmployeesAction(
  input: EmployeeImportBatchInput
): Promise<ActionResult<EmployeeImportResult>> {
  const real = isRealDataEnabled();
  console.info(
    `[employee-import] importEmployeesAction dataSource=${real ? "postgres" : "mock"} rows=${input?.rows?.length ?? 0}`
  );

  if (!real) {
    // Mock mode: simulate success without writing to the database.
    const rows = input?.rows ?? [];
    return {
      success: true,
      data: {
        success: true,
        importedCount: rows.length,
        failedCount: 0,
        totalRows: rows.length,
        errors: [],
        importedEmployeeIds: rows.map((_, i) => `mock-emp-${i + 1}`),
      },
    };
  }

  try {
    const data = await importEmployees(input);
    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/data-management/employee-import");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
