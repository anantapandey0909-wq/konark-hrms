"use server";

import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  listImportHistory,
  type HistoryJobItem,
} from "@/lib/services/import-history.service";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function mockImportHistory(): HistoryJobItem[] {
  return [
    {
      id: "IMP-MOCK001",
      operation: "Import",
      module: "Employees",
      fileName: "—",
      requestedBy: "Harshita Sharma",
      startedAt: "Feb 15, 2025, 06:11 PM",
      completedAt: "Feb 15, 2025, 06:11 PM",
      duration: "—",
      status: "Completed",
      rowsProcessed: "12 rows",
      fileType: "CSV",
      importedRows: 12,
      failedRows: 0,
      skippedRows: 0,
      warnings: 0,
    },
    {
      id: "EXP-MOCK002",
      operation: "Export",
      module: "Payroll",
      fileName: "konark-payroll-EXT-MOCK.xls",
      requestedBy: "Priya Iyer",
      startedAt: "Feb 13, 2025, 11:44 AM",
      completedAt: "Feb 13, 2025, 11:44 AM",
      duration: "—",
      status: "Completed",
      rowsProcessed: "40 rows",
      fileType: "Excel (.xls)",
      importedRows: 40,
      failedRows: 0,
      skippedRows: 0,
      warnings: 0,
    },
  ];
}

export async function fetchImportHistoryAction(): Promise<
  ActionResult<HistoryJobItem[]>
> {
  if (!isRealDataEnabled()) {
    return { success: true, data: mockImportHistory() };
  }

  try {
    const data = await listImportHistory();
    return { success: true, data };
  } catch (error) {
    // Never fall back to mock after a PostgreSQL failure.
    return toSafeActionResult(error);
  }
}
