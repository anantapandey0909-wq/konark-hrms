"use server";

import { revalidatePath } from "next/cache";
import { requireCanBulkUpdateEmployees } from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  previewBulkEmployeeOperation,
  executeBulkEmployeeOperation,
} from "@/lib/services/bulk-employee.service";
import type {
  BulkEmployeeExecuteResult,
  BulkEmployeeOperationInput,
  BulkEmployeePreviewResult,
} from "@/types/bulk-operation";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockPreview(
  input: BulkEmployeeOperationInput
): BulkEmployeePreviewResult {
  const ids = input.employeeIds ?? [];
  const rows = ids.map((id, i) => ({
    employeeId: id,
    employeeCode: `MOCK-${i + 1}`,
    employeeName: `Mock Employee ${i + 1}`,
    departmentName: "Mock Department",
    currentValue:
      input.action === "activate" || input.action === "deactivate"
        ? "INACTIVE"
        : input.action === "transfer-dept"
          ? "Dept A"
          : "—",
    newValue:
      input.action === "activate"
        ? "ACTIVE"
        : input.action === "deactivate"
          ? "TERMINATED"
          : input.action === "transfer-dept"
            ? "Dept B"
            : "Manager",
    status: "valid" as const,
    notes: "Mock preview — no database changes.",
  }));

  return {
    action: input.action,
    rows,
    selectedCount: rows.length,
    validCount: rows.length,
    invalidCount: 0,
    warningCount: 0,
    skippedCount: 0,
    canCommit: rows.length > 0,
  };
}

export async function previewBulkEmployeesAction(
  input: BulkEmployeeOperationInput
): Promise<ActionResult<BulkEmployeePreviewResult>> {
  try {
    await requireCanBulkUpdateEmployees();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    if (!input.employeeIds?.length) {
      return {
        success: false,
        error: "Select at least one employee.",
        code: "VALIDATION",
      };
    }
    return { success: true, data: mockPreview(input) };
  }
  try {
    const data = await previewBulkEmployeeOperation(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function executeBulkEmployeesAction(
  input: BulkEmployeeOperationInput
): Promise<ActionResult<BulkEmployeeExecuteResult>> {
  try {
    await requireCanBulkUpdateEmployees();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    if (!input.employeeIds?.length) {
      return {
        success: false,
        error: "Select at least one employee.",
        code: "VALIDATION",
      };
    }
    return {
      success: true,
      data: {
        action: input.action,
        processedCount: input.employeeIds.length,
        failedCount: 0,
        totalRequested: input.employeeIds.length,
        errors: [],
      },
    };
  }
  try {
    const data = await executeBulkEmployeeOperation(input);
    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/data-management/bulk-operations");
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock after a PostgreSQL failure.
    return toSafeActionResult(error);
  }
}
