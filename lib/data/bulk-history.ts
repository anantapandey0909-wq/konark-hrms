/**
 * Thin bulk-history adapter.
 * Mock vs real is decided inside app/actions/bulk-history.ts.
 */

import { listBulkJobHistoryAction } from "@/app/actions/bulk-history";
import type { BulkJobHistoryRow } from "@/types/bulk-operation";

export async function fetchBulkJobHistory(): Promise<BulkJobHistoryRow[]> {
  const result = await listBulkJobHistoryAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}
