import LeaveDashboard from "@/components/leave/leave-dashboard";
import { fetchLeaveRequests, fetchLeaveStats } from "@/lib/data/leave";
import { isRealDataEnabled } from "@/lib/config/flags";
import type { LeaveRequest, LeaveStatsSummary } from "@/types/leave";

/** Always re-fetch leave list on navigation — no stale static cache. */
export const dynamic = "force-dynamic";

export default async function LeavePage() {
  let initialRequests: LeaveRequest[] = [];
  let initialStats: LeaveStatsSummary = {
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    onLeaveToday: 0,
  };
  let loadError: string | null = null;

  // Evaluated on the server for this Server Component.
  const realData = isRealDataEnabled();

  try {
    const [requests, stats] = await Promise.all([
      fetchLeaveRequests(),
      fetchLeaveStats(),
    ]);
    initialRequests = requests;
    initialStats = stats;
  } catch (error) {
    // Real mode + missing session should NOT fall back to mocks.
    loadError =
      error instanceof Error ? error.message : "Failed to load leave data.";
  }

  return (
    <div className="space-y-2">
      {loadError && (
        <div className="mx-6 mt-4 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
          {realData
            ? " (real-data mode is ON — sign in with real auth so the server can resolve your company.)"
            : " (real-data mode is OFF — mock leave data is active.)"}
        </div>
      )}
      {!loadError && realData && initialRequests.length === 0 && (
        <div className="mx-6 mt-4 rounded-md border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          Real-data mode is ON. No leave requests found for your company yet —
          create one from Apply Leave.
        </div>
      )}
      <LeaveDashboard
        initialRequests={initialRequests}
        initialStats={initialStats}
      />
    </div>
  );
}
