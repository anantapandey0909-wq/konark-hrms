/**
 * Thin admin-dashboard data adapter.
 * Mock vs real is decided inside app/actions/admin-dashboard.ts ("use server").
 */

import { getAdminDashboardAction } from "@/app/actions/admin-dashboard";
import type { AdminDashboardData } from "@/lib/services/admin-dashboard.service";

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const result = await getAdminDashboardAction();
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
