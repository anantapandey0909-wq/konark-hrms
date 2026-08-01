"use client";

import * as React from "react";

import { WelcomeHeader } from "./welcome-header";
import { EmployeeSummary } from "./employee-summary";
import { QuickActions } from "./quick-actions";
import { AttendanceSummaryCard } from "./attendance-summary";
import { LeaveSummary } from "./leave-summary";
import { UpcomingHolidays } from "./upcoming-holidays";
import { Announcements } from "./announcements";
import { NotificationsPreview } from "./notifications-preview";

import {
  mockEmployeeProfile,
  mockAttendanceSummary,
  mockLeaveBalances,
  mockHolidays,
  mockAnnouncements,
  mockNotifications,
} from "@/mock/employee-portal";

import { getStoredUser } from "@/lib/auth/auth-service";

export function EmployeeDashboard() {
  const authUser = getStoredUser();

  const employeeProfile = authUser
    ? {
        id: authUser.id,
        employeeCode: authUser.employeeId,
        name:
          authUser.fullName ??
          `${authUser.firstName} ${authUser.lastName}`,
        email: authUser.email,
        designation: authUser.designation,
        department: authUser.department,
        avatarUrl: authUser.avatarUrl,

        // These will come from the backend later
        joinDate: mockEmployeeProfile.joinDate,
        managerName: mockEmployeeProfile.managerName,
      }
    : mockEmployeeProfile;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeHeader profile={employeeProfile} />

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          <EmployeeSummary profile={employeeProfile} />

          <QuickActions
            initialAttendance={mockAttendanceSummary}
          />

          <UpcomingHolidays
            holidays={mockHolidays}
          />
        </div>

        {/* Center Column */}
        <div className="space-y-6 lg:col-span-1">
          <AttendanceSummaryCard
            summary={mockAttendanceSummary}
          />

          <LeaveSummary
            balances={mockLeaveBalances}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-1">
          <NotificationsPreview
            initialNotifications={mockNotifications}
          />

          <Announcements
            announcements={mockAnnouncements}
          />
        </div>
      </div>
    </div>
  );
}