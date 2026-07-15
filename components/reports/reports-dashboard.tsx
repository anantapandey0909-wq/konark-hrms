"use client";

import { Users, Clock, CalendarDays, DollarSign } from "lucide-react";
import type { ReportSummary } from "@/types/reports";
import {
  calculateEmployeeMetrics,
  getAttendanceMetrics,
  calculateLeaveMetrics,
  getPayrollMetrics,
} from "@/lib/reports";
import ReportSummaryCard from "./report-summary-card";
import { ReportsFilters } from "./reports-filters";
import { ReportsOverview } from "./reports-overview";
import { ReportsChartSection } from "./reports-chart-section";
import { ReportsLoading } from "./reports-loading";
import { ReportsEmptyState } from "./reports-empty-state";

// Static placeholders for controlled filter inputs to bypass active state
const DEFAULT_SEARCH = "";
const DEFAULT_DEPARTMENT = "all";
const DEFAULT_DATE_RANGE = "this-month";

const handleSearchChange = (): void => {};
const handleDepartmentChange = (): void => {};
const handleDateRangeChange = (): void => {};

// Pure scope formatting helpers
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export default function ReportsDashboard() {
  const isLoading = false;
  const isEmpty = false;

  // Consume normalized metrics directly from the domain layer
  const employeeMetrics = calculateEmployeeMetrics();
  const attendanceMetrics = getAttendanceMetrics();
  const leaveMetrics = calculateLeaveMetrics();
  const payrollMetrics = getPayrollMetrics();

  // Create immutable summary list with stable unique identifiers
  const summaries: ReportSummary[] = [
    {
      id: "total-workforce",
      title: "Total Workforce",
      value: employeeMetrics.totalEmployees,
      description: `${employeeMetrics.activeEmployees} active personnel in system`,
      icon: Users,
    },
    {
      id: "attendance-rate",
      title: "Attendance Rate",
      value: formatPercent(attendanceMetrics.attendanceRate),
      description: "Average daily presence rate across system",
      icon: Clock,
    },
    {
      id: "pending-leaves",
      title: "Pending Leaves",
      value: leaveMetrics.pendingRequests,
      description: "Leave requests awaiting structural review",
      icon: CalendarDays,
    },
    {
      id: "net-payroll",
      title: "Net Payroll Cost",
      value: formatCurrency(payrollMetrics.totalNetSalary),
      description: "Total net salary allocated for the current cycle",
      icon: DollarSign,
    },
  ];

  if (isLoading) {
    return <ReportsLoading />;
  }

  if (isEmpty) {
    return <ReportsEmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Page Heading and Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Consolidated enterprise intelligence, organizational distribution, and historical metrics.
        </p>
      </div>

      {/* Composition: Orchestrated Filters Toolbar */}
      <ReportsFilters
        searchQuery={DEFAULT_SEARCH}
        onSearchQueryChange={handleSearchChange}
        department={DEFAULT_DEPARTMENT}
        onDepartmentChange={handleDepartmentChange}
        dateRange={DEFAULT_DATE_RANGE}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Composition: Orchestrated KPI Summary Matrix using stable summary.id */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaries.map((summary) => (
          <ReportSummaryCard
            key={summary.id}
            summary={summary}
          />
        ))}
      </div>
      {/* Debug Start */}
<div className="rounded-lg bg-red-500 p-8 text-2xl font-bold text-white">
  BEFORE OVERVIEW
</div>

<ReportsOverview />

<section className="space-y-4 pt-4">
  <div>
    <h2 className="text-xl font-semibold tracking-tight">
      Analytics Charts
    </h2>

    <p className="text-sm text-muted-foreground">
      Interactive visualizations and workforce trends.
    </p>
  </div>

  <ReportsChartSection />
</section>

<div className="rounded-lg bg-green-500 p-8 text-2xl font-bold text-white">
  AFTER OVERVIEW
</div>

{/* Charts */}
<ReportsChartSection />

      {/* Composition: Detailed System Overviews */}
      <ReportsOverview />

      {/* Composition: Visual Layout Trends Section */}
      <ReportsChartSection />
    </div>
  );
}