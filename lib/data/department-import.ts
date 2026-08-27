/**
 * Thin department-import adapter.
 * Mock vs real is decided inside app/actions/department-import.ts.
 */

import {
  importDepartmentsAction,
  previewDepartmentImportAction,
} from "@/app/actions/department-import";
import type {
  DepartmentImportBatchInput,
  DepartmentImportPreviewResult,
  DepartmentImportResult,
} from "@/lib/validation/department-import";

export async function previewDepartmentImportBatch(
  input: DepartmentImportBatchInput
): Promise<DepartmentImportPreviewResult> {
  const result = await previewDepartmentImportAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function executeDepartmentImport(
  input: DepartmentImportBatchInput
): Promise<DepartmentImportResult> {
  const result = await importDepartmentsAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
