"use server";

import { revalidatePath } from "next/cache";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import { importLeaveRequests } from "@/lib/services/leave-import.service";
import type {
  LeaveImportBatchInput,
  LeaveImportResult,
} from "@/lib/validation/leave-import";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export async function importLeaveRequestsAction(
  input: LeaveImportBatchInput
): Promise<ActionResult<LeaveImportResult>> {
  const real = isRealDataEnabled();
  console.info(
    `[leave-import] importLeaveRequestsAction dataSource=${real ? "postgres" : "mock"} rows=${input?.rows?.length ?? 0}`
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
        importedIds: rows.map((_, i) => `mock-leave-${i + 1}`),
      },
    };
  }

  try {
    const data = await importLeaveRequests(input);
    revalidatePath("/dashboard/leave");
    revalidatePath("/dashboard/data-management/leave-import");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock when PostgreSQL fails.
    return toSafeActionResult(error);
  }
}
