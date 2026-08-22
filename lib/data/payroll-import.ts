/**
 * Thin payroll-import adapter.
 * Mock vs real is decided inside app/actions/payroll-import.ts.
 */

import { importPayrollRecordsAction } from "@/app/actions/payroll-import";
import type {
  PayrollImportBatchInput,
  PayrollImportResult,
} from "@/lib/validation/payroll-import";

export async function executePayrollImport(
  input: PayrollImportBatchInput
): Promise<PayrollImportResult> {
  const result = await importPayrollRecordsAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
