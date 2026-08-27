/**
 * Thin import-history adapter.
 * Mock vs real is decided inside app/actions/import-history.ts.
 */

import { fetchImportHistoryAction } from "@/app/actions/import-history";
import type { HistoryJobItem } from "@/lib/services/import-history.service";

export type { HistoryJobItem };

export async function fetchImportHistory(): Promise<HistoryJobItem[]> {
  const result = await fetchImportHistoryAction();
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
