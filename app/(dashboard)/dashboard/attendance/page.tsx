import type { AttendanceWithEmployee } from "@/types/attendance";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";
import {
  fetchAttendanceList,
  fetchAttendanceMetrics,
} from "@/lib/data/attendance";
import { AttendancePageClient } from "./attendance-page-client";

/**
 * Server Component: load attendance list + independent KPI metrics.
 * Mock vs real is handled inside data adapters via feature flag.
 */
export default async function AttendancePage() {
  let initialData: AttendanceWithEmployee[] = [];
  let initialMetrics: AttendanceMetrics = {
    totalRecords: 0,
    presentCount: 0,
    lateCount: 0,
    halfDayCount: 0,
    absentCount: 0,
    onLeaveCount: 0,
    averageWorkingHours: 0,
    totalOvertimeHours: 0,
    regularizationCount: 0,
  };

  try {
    const [list, metrics] = await Promise.all([
      fetchAttendanceList(),
      fetchAttendanceMetrics(),
    ]);
    initialData = list;
    initialMetrics = metrics;
  } catch {
    // Unauthenticated / mock-auth without cookie: empty list + zero metrics.
  }

  return (
    <AttendancePageClient
      initialData={initialData}
      initialMetrics={initialMetrics}
    />
  );
}
