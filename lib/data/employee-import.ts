/**
 * Thin employee-import adapter.
 * Mock vs real is decided inside app/actions/employee-import.ts.
 */

import { importEmployeesAction } from "@/app/actions/employee-import";
import type {
  EmployeeImportBatchInput,
  EmployeeImportResult,
} from "@/lib/validation/employee-import";

export async function executeEmployeeImport(
  input: EmployeeImportBatchInput
): Promise<EmployeeImportResult> {
  const result = await importEmployeesAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
