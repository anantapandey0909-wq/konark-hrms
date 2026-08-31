"use server";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { assertProductionRealData } from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import { listBulkJobHistory } from "@/lib/services/bulk-history.service";
import type { BulkJobHistoryRow } from "@/types/bulk-operation";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockBulkJobHistory(): BulkJobHistoryRow[] {
  return [
    {
      jobId: "BCH-MOCK001",
      operation: "Activate Employees",
      module: "Employees",
      requestedBy: "Harshita Sharma",
      requestedOn: "Feb 15, 2025, 02:40 PM",
      duration: "—",
      status: "Completed",
      affectedRecords: "12 employees",
    },
    {
      jobId: "BCH-MOCK002",
      operation: "Transfer Department",
      module: "Employees",
      requestedBy: "Rohan Verma",
      requestedOn: "Feb 14, 2025, 08:30 AM",
      duration: "—",
      status: "Completed",
      affectedRecords: "8 employees",
    },
    {
      jobId: "BCH-MOCK003",
      operation: "Deactivate Employees",
      module: "Employees",
      requestedBy: "Priya Iyer",
      requestedOn: "Feb 13, 2025, 11:45 AM",
      duration: "—",
      status: "Completed",
      affectedRecords: "3 employees",
    },
  ];
}

export async function listBulkJobHistoryAction(): Promise<
  ActionResult<BulkJobHistoryRow[]>
> {
  try {
    await requireCurrentUser();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return { success: true, data: mockBulkJobHistory() };
  }

  try {
    const data = await listBulkJobHistory();
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock after a PostgreSQL failure.
    return toSafeActionResult(error);
  }
}
