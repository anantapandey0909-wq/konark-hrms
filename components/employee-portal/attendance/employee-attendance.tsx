"use client";

import * as React from "react";
import { AttendanceOverview } from "./attendance-overview";
import { AttendanceCalendar } from "./attendance-calendar";
import { AttendanceTimeline } from "./attendance-timeline";
import { AttendanceStatistics } from "./attendance-statistics";
import { WorkingHours } from "./working-hours";
import { ShiftInformation } from "./shift-information";
import { AttendanceActions } from "./attendance-actions";

// High fidelity dataset representing employee login history and configuration for October 2025
const mockAttendanceData = {
  overview: {
    daysPresent: 18,
    daysAbsent: 0,
    daysOnLeave: 2,
    holidays: 1,
    averageHoursLogged: "8.4h",
    complianceRate: 96.8,
  },
  shift: {
    name: "General Shift (GS-1)",
    timings: "09:00 AM - 06:00 PM",
    gracePeriod: "15 Minutes",
    breakDuration: "1 Hour (01:00 PM - 02:00 PM)",
    weeklyOffs: "Saturday, Sunday",
  },
  statistics: [
    { label: "Week 1", hours: 41.2 },
    { label: "Week 2", hours: 42.5 },
    { label: "Week 3", hours: 39.8 },
    { label: "Week 4", hours: 44.0 },
  ],
  workingHours: {
    regularHours: 162,
    overtimeHours: 5.5,
    underTimeHours: 1.2,
  },
  calendarDays: [
    { date: "2025-10-01", status: "PRESENT" as const, punchIn: "08:55 AM", punchOut: "06:02 PM" },
    { date: "2025-10-02", status: "HOLIDAY" as const },
    { date: "2025-10-03", status: "PRESENT" as const, punchIn: "08:58 AM", punchOut: "06:15 PM" },
    { date: "2025-10-04", status: "WEEKEND" as const },
    { date: "2025-10-05", status: "WEEKEND" as const },
    { date: "2025-10-06", status: "PRESENT" as const, punchIn: "08:52 AM", punchOut: "06:05 PM" },
    { date: "2025-10-07", status: "PRESENT" as const, punchIn: "09:12 AM", punchOut: "06:00 PM" }, // Late but in grace
    { date: "2025-10-08", status: "LEAVE" as const },
    { date: "2025-10-09", status: "LEAVE" as const },
    { date: "2025-10-10", status: "PRESENT" as const, punchIn: "08:45 AM", punchOut: "05:45 PM" },
  ],
  timelineLogs: [
    { id: "log-1", activity: "Punch-In Recorded", time: "08:55 AM", date: "Oct 24, 2025", location: "Web App (IP: 192.168.1.45)" },
    { id: "log-2", activity: "Punch-Out Recorded", time: "06:02 PM", date: "Oct 24, 2025", location: "Web App (IP: 192.168.1.45)" },
    { id: "log-3", activity: "Punch-In Recorded", time: "08:58 AM", date: "Oct 23, 2025", location: "Mobile App (GPS Verified)" },
    { id: "log-4", activity: "Punch-Out Recorded", time: "06:15 PM", date: "Oct 23, 2025", location: "Mobile App (GPS Verified)" },
  ],
};

export function EmployeeAttendance() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Attendance Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review structural work hours, regularizations, calendars, and weekly compliance scores.
        </p>
      </div>

      {/* Main Metrics Overview */}
      <AttendanceOverview data={mockAttendanceData.overview} />

      {/* Core Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Calendar and Shift Configurations */}
        <div className="space-y-6 lg:col-span-2">
          <AttendanceCalendar days={mockAttendanceData.calendarDays} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ShiftInformation shift={mockAttendanceData.shift} />
            <WorkingHours hours={mockAttendanceData.workingHours} />
          </div>
        </div>

        {/* Right Side: Timeline and Weekly analytics */}
        <div className="space-y-6 lg:col-span-1">
          <AttendanceActions />
          <AttendanceStatistics stats={mockAttendanceData.statistics} />
          <AttendanceTimeline logs={mockAttendanceData.timelineLogs} />
        </div>
      </div>
    </div>
  );
}