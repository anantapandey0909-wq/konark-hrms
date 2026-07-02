import React from "react";
import AttendanceStats from "@/components/attendance/attendance-stats";
import ClockInCard from "@/components/attendance/clock-in-card";
import AttendanceTable from "@/components/attendance/attendance-table";

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-64px)] bg-neutral-50/40 dark:bg-neutral-950/20">
      {/* Dashboard Page Header */}
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Attendance Management
        </h1>
        <p className="text-sm text-muted-foreground max-w-4xl leading-relaxed">
          Monitor attendance, working hours, employee presence, and daily activity across the organization.
        </p>
      </div>

      {/* Aggregate Statistics Component Row */}
      <AttendanceStats />

      {/* Primary Dashboard Operational Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* Interactive Console - Left Block on Large Screens */}
        <div className="lg:col-span-1 h-full">
          <ClockInCard />
        </div>

        {/* Detailed Logs Database Table - Right Block on Large Screens */}
        <div className="lg:col-span-2 w-full overflow-hidden">
          <AttendanceTable />
        </div>
      </div>
    </div>
  );
}