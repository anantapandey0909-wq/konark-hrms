import LeaveDashboard from "@/components/leave/leave-dashboard";
import { fetchLeaveRequests, fetchLeaveStats } from "@/lib/data/leave";
import type { LeaveRequest, LeaveStatsSummary } from "@/types/leave";

/** Always re-fetch leave list (mock or DB) on navigation — no stale static cache. */
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

  try {
    const [requests, stats] = await Promise.all([
      fetchLeaveRequests(),
      fetchLeaveStats(),
    ]);
    initialRequests = requests;
    initialStats = stats;
  } catch {
    // Unauthenticated / no session: empty dashboard (not mock fallback in real mode)
  }

  return (
    <LeaveDashboard
      initialRequests={initialRequests}
      initialStats={initialStats}
    />
  );
}
