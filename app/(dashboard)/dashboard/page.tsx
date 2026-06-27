import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentEmployees } from "@/components/dashboard/recent-employees";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Dashboard
        </h1>

        <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back. Here's a live overview of your organization,
          employee attendance, payroll progress and recent activities.
        </p>
      </section>

      {/* KPI Cards */}
      <KPICards />

      {/* Analytics */}
      <section className="grid gap-6 xl:grid-cols-6">
        <div className="xl:col-span-4">
          <AttendanceChart />
        </div>

        <div className="xl:col-span-2">
          <QuickActions />
        </div>
      </section>

      {/* Tables */}
      <section className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-3">
          <RecentEmployees />
        </div>

        <div className="xl:col-span-1">
          <RecentActivity />
        </div>
      </section>
    </div>
  );
}