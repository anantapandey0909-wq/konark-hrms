/**
 * Thin bulk-employee adapter.
 * Mock vs real is decided inside app/actions/bulk-employee.ts.
 */

import {
  previewBulkEmployeesAction,
  executeBulkEmployeesAction,
} from "@/app/actions/bulk-employee";
import type {
  BulkEmployeeExecuteResult,
  BulkEmployeeOperationInput,
  BulkEmployeePreviewResult,
} from "@/types/bulk-operation";

export async function previewBulkEmployees(
  input: BulkEmployeeOperationInput
): Promise<BulkEmployeePreviewResult> {
  const result = await previewBulkEmployeesAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function executeBulkEmployees(
  input: BulkEmployeeOperationInput
): Promise<BulkEmployeeExecuteResult> {
  const result = await executeBulkEmployeesAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
