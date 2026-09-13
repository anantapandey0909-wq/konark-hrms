import LeaveDashboard from "@/components/leave/leave-dashboard";
import { fetchLeaveRequests, fetchLeaveStats } from "@/lib/data/leave";
import { isRealDataEnabled } from "@/lib/config/flags";
import type { LeaveRequest, LeaveStatsSummary } from "@/types/leave";

/** Always re-fetch leave list on navigation — no stale static cache. */
export const dynamic = "force-dynamic";

const INITIAL_PAGE = 1;
const INITIAL_PAGE_SIZE = 10;

export default async function LeavePage() {
  let initialRequests: LeaveRequest[] = [];
  let initialTotal = 0;
  let initialPage = INITIAL_PAGE;
  let initialPageSize = INITIAL_PAGE_SIZE;
  let initialStats: LeaveStatsSummary = {
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    onLeaveToday: 0,
  };
  let loadError: string | null = null;

  // Server-side only. If this is false, listLeaveRequestsAction serves mocks.
  const realData = isRealDataEnabled();

  try {
    const [listResult, stats] = await Promise.all([
      fetchLeaveRequests({ page: INITIAL_PAGE, pageSize: INITIAL_PAGE_SIZE }),
      fetchLeaveStats(),
    ]);
    initialRequests = listResult.items;
    initialTotal = listResult.total;
    initialPage = listResult.page;
    initialPageSize = listResult.pageSize;
    initialStats = stats;
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load leave data.";
  }

  return (
    <div className="space-y-2">
      <div
        className={`mx-6 mt-4 rounded-md border px-4 py-2 text-xs ${
          realData
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
            : "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100"
        }`}
      >
        Leave data source:{" "}
        <strong>{realData ? "PostgreSQL (real data)" : "in-memory mocks"}</strong>
        {" · "}
        NEXT_PUBLIC_USE_REAL_DATA=
        {String(process.env.NEXT_PUBLIC_USE_REAL_DATA ?? "(unset)")}
        {" · "}
        records={initialTotal}
        {" · "}
        page={initialPage}/{Math.max(1, Math.ceil(initialTotal / initialPageSize))}
      </div>

      {loadError && (
        <div className="mx-6 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
          {realData
            ? " — real-data mode is ON; sign in with real auth so the server can resolve your company."
            : " — real-data mode is OFF."}
        </div>
      )}

      {!loadError && realData && initialTotal === 0 && (
        <div className="mx-6 rounded-md border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          Real-data mode is ON. No leave requests found for your company yet —
          create one from Apply Leave.
        </div>
      )}

      <LeaveDashboard
        initialRequests={initialRequests}
        initialTotal={initialTotal}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
        initialStats={initialStats}
      />
    </div>
  );
}
