"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import { importAttendance } from "@/lib/services/attendance-import.service";
import type {
  AttendanceImportBatchInput,
  AttendanceImportResult,
} from "@/lib/validation/attendance-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export async function importAttendanceAction(
  input: AttendanceImportBatchInput
): Promise<ActionResult<AttendanceImportResult>> {
  const real = isRealDataEnabled();
  console.info(
    `[attendance-import] importAttendanceAction dataSource=${real ? "postgres" : "mock"} rows=${input?.rows?.length ?? 0}`
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
        importedIds: rows.map((_, i) => `mock-att-${i + 1}`),
      },
    };
  }

  try {
    const data = await importAttendance(input);
    revalidatePath("/dashboard/attendance");
    revalidatePath("/dashboard/data-management/attendance-import");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
