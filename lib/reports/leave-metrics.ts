import type { LeaveMetrics } from "@/types/report-metrics";

/**
 * Builds aggregated leave request metrics for the Reports module.
 * Accepts any array of leave-like records with a `status` field so both
 * mock and PostgreSQL paths can share the same calculation.
 */
export function calculateLeaveMetrics(
  requests: readonly { status: string }[]
): LeaveMetrics {
  const totalRequests = requests.length;
  let approvedRequests = 0;
  let pendingRequests = 0;
  let rejectedRequests = 0;
  let cancelledRequests = 0;

  for (const request of requests) {
    switch (request.status) {
      case "APPROVED":
        approvedRequests++;
        break;
      case "PENDING":
        pendingRequests++;
        break;
      case "REJECTED":
        rejectedRequests++;
        break;
      case "CANCELLED":
        cancelledRequests++;
        break;
      default:
        break;
    }
  }

  return {
    totalRequests,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
    cancelledRequests,
  };
}
