/**
 * Thin leave-import adapter.
 * Mock vs real is decided inside app/actions/leave-import.ts.
 */

import { importLeaveRequestsAction } from "@/app/actions/leave-import";
import type {
  LeaveImportBatchInput,
  LeaveImportResult,
} from "@/lib/validation/leave-import";

export async function executeLeaveImport(
  input: LeaveImportBatchInput
): Promise<LeaveImportResult> {
  const result = await importLeaveRequestsAction(input);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
