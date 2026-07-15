import { mockLeaveRequests } from '@/mock/leave';
import type { LeaveMetrics } from '@/types/report-metrics';

/**
 * Builds aggregated leave request metrics for the Reports module by processing status.
 * This utility performs a single-pass aggregation over mock leave requests to generate
 * high-level statistics without modifying the underlying data source.
 * 
 * @returns {LeaveMetrics} Summarized leave request statistics for reporting.
 */
export function calculateLeaveMetrics(): LeaveMetrics {
  const totalRequests = mockLeaveRequests.length;
  let approvedRequests = 0;
  let pendingRequests = 0;
  let rejectedRequests = 0;
  let cancelledRequests = 0;

  for (const request of mockLeaveRequests) {
    switch (request.status) {
      case 'APPROVED':
        approvedRequests++;
        break;
      case 'PENDING':
        pendingRequests++;
        break;
      case 'REJECTED':
        rejectedRequests++;
        break;
      case 'CANCELLED':
        cancelledRequests++;
        break;
      default:
        // Safely capture records with unexpected status values
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