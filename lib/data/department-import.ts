/**
 * Thin department-import adapter.
 * Mock vs real is decided inside app/actions/department-import.ts.
 */

import { importDepartmentsAction } from "@/app/actions/department-import";
import type {
  DepartmentImportBatchInput,
  DepartmentImportResult,
} from "@/lib/validation/department-import";

export async function executeDepartmentImport(
  input: DepartmentImportBatchInput
): Promise<DepartmentImportResult> {
  const result = await importDepartmentsAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
