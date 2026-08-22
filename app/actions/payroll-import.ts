"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import { importPayrollRecords } from "@/lib/services/payroll-import.service";
import type {
  PayrollImportBatchInput,
  PayrollImportResult,
} from "@/lib/validation/payroll-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export async function importPayrollRecordsAction(
  input: PayrollImportBatchInput
): Promise<ActionResult<PayrollImportResult>> {
  const real = isRealDataEnabled();
  console.info(
    `[payroll-import] importPayrollRecordsAction dataSource=${real ? "postgres" : "mock"} rows=${input?.rows?.length ?? 0}`
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
        importedIds: rows.map((_, i) => `mock-pay-${i + 1}`),
      },
    };
  }

  try {
    const data = await importPayrollRecords(input);
    revalidatePath("/dashboard/payroll");
    revalidatePath("/dashboard/data-management/payroll-import");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
