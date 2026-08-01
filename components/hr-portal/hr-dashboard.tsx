"use client";

import { HRKPICards } from "./hr-kpi-cards";
import { HRQuickActions } from "./hr-quick-actions";
import { PendingLeaves } from "./pending-leaves";
import { RecentEmployees } from "./recent-employees";

export function HRDashboard() {
  return (
    <div className="space-y-8">
      {/* ====================================================== */}
      {/* Dashboard Header */}
      {/* ====================================================== */}

      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          HR Dashboard
        </h1>

        <p className="max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back. Monitor workforce operations, employee onboarding,
          attendance, leave approvals and organizational activity from one
          centralized workspace.
        </p>
      </section>

      {/* ====================================================== */}
      {/* KPI Section */}
      {/* ====================================================== */}

      <HRKPICards />

      {/* ====================================================== */}
      {/* Main Content */}
      {/* ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-6">
        <div className="xl:col-span-4">
          <PendingLeaves />
        </div>

        <div className="xl:col-span-2">
          <HRQuickActions />
        </div>
      </section>

      {/* ====================================================== */}
      {/* Bottom Section */}
      {/* ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-3">
          <RecentEmployees />
        </div>

        <div className="xl:col-span-1">
          {/* Reserved for future HR widgets
              Upcoming Birthdays
              Employee Announcements
              Recruitment Progress
              Holiday Calendar
          */}
        </div>
      </section>
    </div>
  );
}

export default HRDashboard;