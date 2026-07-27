"use client";

import * as React from "react";
import { LeaveOverview } from "./leave-overview";
import { LeaveBalance } from "./leave-balance";
import { LeaveHistory } from "./leave-history";
import { ApplyLeave } from "./apply-leave";
import { ApprovalTimeline } from "./approval-timeline";
import { UpcomingLeave } from "./upcoming-leave";
import { LeaveActions } from "./leave-actions";

// Full structural leave database mocks for Arjun Sharma (October 2025)
const mockLeaveData = {
  overview: {
    totalAllocated: 45,
    totalUsed: 17,
    totalPending: 3,
    totalAvailable: 25,
  },
  balances: [
    { id: "b1", type: "CASUAL" as const, name: "Casual Leave", allocated: 12, used: 4, pending: 1, color: "text-amber-500" },
    { id: "b2", type: "SICK" as const, name: "Sick Leave", allocated: 10, used: 2, pending: 0, color: "text-rose-500" },
    { id: "b3", type: "ANNUAL" as const, name: "Annual Leave", allocated: 18, used: 8, pending: 2, color: "text-indigo-500" },
    { id: "b4", type: "COMPENSATORY" as const, name: "Compensatory Off", allocated: 5, used: 3, pending: 0, color: "text-emerald-500" },
  ],
  upcoming: [
    { id: "ul-1", type: "Casual Leave", dateRange: "Nov 12, 2025 - Nov 14, 2025", days: 3, status: "APPROVED" as const },
    { id: "ul-2", type: "Annual Leave", dateRange: "Dec 22, 2025 - Dec 24, 2025", days: 3, status: "APPROVED" as const },
  ],
  history: [
    { id: "lh-1", type: "Annual Leave", dateRange: "Oct 08, 2025 - Oct 09, 2025", days: 2, status: "APPROVED" as const, reason: "Family Function", appliedAt: "2025-10-01" },
    { id: "lh-2", type: "Casual Leave", dateRange: "Sep 15, 2025", days: 1, status: "APPROVED" as const, reason: "Personal Work", appliedAt: "2025-09-12" },
    { id: "lh-3", type: "Sick Leave", dateRange: "Aug 04, 2025", days: 1, status: "APPROVED" as const, reason: "Medical Routine", appliedAt: "2025-08-04" },
    { id: "lh-4", type: "Casual Leave", dateRange: "Jul 10, 2025", days: 1, status: "REJECTED" as const, reason: "Extended Weekend", appliedAt: "2025-07-02" },
  ],
  timeline: {
    requestType: "Annual Leave",
    dateRange: "Dec 22, 2025 - Dec 24, 2025",
    steps: [
      { id: "s1", title: "Applied", description: "Submitted successfully by Arjun Sharma", status: "COMPLETED" as const, date: "2025-10-24" },
      { id: "s2", title: "Manager Approval", description: "Pending decision by Neha Gupta", status: "PENDING" as const },
      { id: "s3", title: "HR Processing", description: "System verification of leave metrics", status: "UPCOMING" as const },
    ],
  },
};

export function EmployeeLeave() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Leave Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage leave balances, request paid time off, and track verification timelines.
        </p>
      </div>

      {/* Leave Metrics Overview */}
      <LeaveOverview overview={mockLeaveData.overview} />

      {/* Grid Allocation Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Columns: Apply Form & History Logs */}
        <div className="space-y-6 lg:col-span-2">
          <ApplyLeave balances={mockLeaveData.balances} />
          <LeaveHistory history={mockLeaveData.history} />
        </div>

        {/* Right Column: Balances, Timelines & Actions */}
        <div className="space-y-6 lg:col-span-1">
          <LeaveBalance balances={mockLeaveData.balances} />
          <ApprovalTimeline timeline={mockLeaveData.timeline} />
          <UpcomingLeave leaves={mockLeaveData.upcoming} />
          <LeaveActions />
        </div>
      </div>
    </div>
  );
}