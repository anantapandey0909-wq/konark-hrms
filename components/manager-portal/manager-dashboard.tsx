"use client";

import React, { useEffect, useState } from "react";

import { WelcomeHeader } from "./welcome-header";
import { ManagerSummary } from "./manager-summary";
import { TeamOverview } from "./team-overview";
import { AttendanceOverview } from "./attendance-overview";
import { PendingApprovals } from "./pending-approvals";
import { PerformanceSummary } from "./performance-summary";
import { QuickActions } from "./quick-actions";
import { Announcements } from "./announcements";
import { UpcomingEvents } from "./upcoming-events";
import { LoadingSkeleton } from "./loading-skeleton";

import { generateDashboardStats } from "@/lib/manager/utils";

import {
  mockManagerProfile,
  mockTeamMembers,
  mockAttendanceSummary,
  mockPerformanceSummary,
  mockApprovalRequests,
  mockAnnouncements,
  mockUpcomingEvents,
} from "@/mock/manager-portal";

// ⚠️ Change this import if your auth-service is in a different folder
import { getStoredUser } from "@/lib/auth/auth-service";

export function ManagerDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const stats = generateDashboardStats(
    mockTeamMembers,
    mockApprovalRequests
  );

  const authUser = getStoredUser();

  const managerProfile = authUser
    ? {
        id: authUser.id,
        name:
          authUser.fullName ??
          `${authUser.firstName} ${authUser.lastName}`,
        designation: authUser.designation,
        department: authUser.department,
        avatarUrl: authUser.avatarUrl,
        teamSize: mockTeamMembers.length,
      }
    : mockManagerProfile;

  return (
    <div className="space-y-6">
      <WelcomeHeader profile={managerProfile} />

      <ManagerSummary stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6">
          <TeamOverview team={mockTeamMembers} />
          <QuickActions />
          <UpcomingEvents events={mockUpcomingEvents} />
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <AttendanceOverview summary={mockAttendanceSummary} />
          <PerformanceSummary
            summary={mockPerformanceSummary}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PendingApprovals
            approvals={mockApprovalRequests}
          />
          <Announcements
            announcements={mockAnnouncements}
          />
        </div>
      </div>
    </div>
  );
}