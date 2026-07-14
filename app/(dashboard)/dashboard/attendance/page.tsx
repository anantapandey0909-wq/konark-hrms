"use client";

import { useMemo, useState } from "react";

import AttendanceStats from "@/components/attendance/attendance-stats";
import ClockInCard from "@/components/attendance/clock-in-card";
import { AttendanceFilters as AttendanceFiltersPanel } from "@/components/attendance/attendance-filters";
import { AttendanceTable } from "@/components/attendance/attendance-table";

import { applyAttendanceFilters } from "@/lib/attendance/filters";

import { mockAttendanceRecords } from "@/mock/attendance";
import { mockEmployees } from "@/mock/employee";

import type { AttendanceFilters } from "@/types/attendance";

// Reusable constant for initializing and resetting dashboard filters.
const INITIAL_ATTENDANCE_FILTERS: AttendanceFilters = {
  employeeId: undefined,
  department: undefined,
  status: undefined,
  location: undefined,
  shiftName: undefined,
  search: undefined,
  startDate: undefined,
  endDate: undefined,
  isRegularized: undefined,
};

export default function AttendancePage() {
  const [filters, setFilters] = useState<AttendanceFilters>(
    INITIAL_ATTENDANCE_FILTERS
  );

  // Employee dropdown options
  const employeeOptions = useMemo(() => {
    return mockEmployees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
    }));
  }, []);

  // Department dropdown options
  const departmentOptions = useMemo(() => {
    const departments = mockEmployees.map((employee) => employee.department);

    const uniqueDepartments = Array.from(new Set(departments));

    return uniqueDepartments.sort((a, b) => a.localeCompare(b));
  }, []);

  // Apply all attendance filters
  const filteredRecords = useMemo(() => {
    return applyAttendanceFilters(mockAttendanceRecords, filters);
  }, [filters]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col gap-6 bg-neutral-50/40 p-6 dark:bg-neutral-950/20">
      {/* Page Header */}
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Attendance Management
        </h1>

        <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
          Monitor attendance, working hours, employee presence, and daily
          activity across the organization.
        </p>
      </div>

      {/* Dashboard Statistics */}
      <AttendanceStats />

      {/* Main Dashboard */}
      <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Clock In Panel */}
        <div className="h-full lg:col-span-1">
          <ClockInCard />
        </div>

        {/* Attendance Table Section */}
        <div className="flex w-full flex-col gap-4 overflow-hidden lg:col-span-2">
          <AttendanceFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            employees={employeeOptions}
            departments={departmentOptions}
          />

          <AttendanceTable records={filteredRecords} />
        </div>
      </div>
    </div>
  );
}
