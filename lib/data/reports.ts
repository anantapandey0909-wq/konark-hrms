/**
 * Thin reports data adapter.
 * Mock vs real is decided inside app/actions/reports.ts ("use server").
 */

import { getReportsDashboardAction } from "@/app/actions/reports";
import type { ReportsDashboardData } from "@/lib/services/reports.service";

export async function fetchReportsDashboard(): Promise<ReportsDashboardData> {
  const result = await getReportsDashboardAction();
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
