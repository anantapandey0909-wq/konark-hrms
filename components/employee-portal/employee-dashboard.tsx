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
  mockNotifications 
} from "@/mock/employee-portal";

export function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      {/* Time Based Custom Banner Area */}
      <WelcomeHeader profile={mockEmployeeProfile} />

      {/* Segment Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Structural Details and actions */}
        <div className="space-y-6 lg:col-span-1">
          <EmployeeSummary profile={mockEmployeeProfile} />
          <QuickActions initialAttendance={mockAttendanceSummary} />
          <UpcomingHolidays holidays={mockHolidays} />
        </div>

        {/* Center column: Primary Analytics and Leave configurations */}
        <div className="space-y-6 lg:col-span-1">
          <AttendanceSummaryCard summary={mockAttendanceSummary} />
          <LeaveSummary balances={mockLeaveBalances} />
        </div>

        {/* Right column: Communication feed and action alerts */}
        <div className="space-y-6 lg:col-span-1">
          <NotificationsPreview initialNotifications={mockNotifications} />
          <Announcements announcements={mockAnnouncements} />
        </div>
      </div>
    </div>
  );
}