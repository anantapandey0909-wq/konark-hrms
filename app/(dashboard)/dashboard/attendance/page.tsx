import type { AttendanceWithEmployee } from "@/types/attendance";
import type { AttendanceMetrics } from "@/lib/reports/attendance-metrics";
import {
  fetchAttendanceList,
  fetchAttendanceMetrics,
} from "@/lib/data/attendance";
import { AttendancePageClient } from "./attendance-page-client";

const INITIAL_PAGE = 1;
const INITIAL_PAGE_SIZE = 10;

/**
 * Server Component: load paginated attendance list + independent KPI metrics.
 */
export default async function AttendancePage() {
  let initialData: AttendanceWithEmployee[] = [];
  let initialTotal = 0;
  let initialPage = INITIAL_PAGE;
  let initialPageSize = INITIAL_PAGE_SIZE;
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
    const [listResult, metrics] = await Promise.all([
      fetchAttendanceList({ page: INITIAL_PAGE, pageSize: INITIAL_PAGE_SIZE }),
      fetchAttendanceMetrics(),
    ]);
    initialData = listResult.items;
    initialTotal = listResult.total;
    initialPage = listResult.page;
    initialPageSize = listResult.pageSize;
    initialMetrics = metrics;
  } catch {
    // Unauthenticated / mock-auth without cookie: empty list + zero metrics.
  }

  return (
    <AttendancePageClient
      initialData={initialData}
      initialTotal={initialTotal}
      initialPage={initialPage}
      initialPageSize={initialPageSize}
      initialMetrics={initialMetrics}
    />
  );
}
