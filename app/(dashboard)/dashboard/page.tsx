import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";
import { getRoleRoute } from "@/lib/auth/role-routes";
import { fetchAdminDashboard } from "@/lib/data/admin-dashboard";

import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentEmployees } from "@/components/dashboard/recent-employees";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Non-ADMIN roles land on existing role routes (attendance, payroll, portals, …).
  if (user.role !== "ADMIN") {
    redirect(getRoleRoute(user.role));
  }

  let data;
  let loadError: string | null = null;
  try {
    data = await fetchAdminDashboard();
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Failed to load dashboard metrics.";
    data = null;
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Dashboard
        </h1>

        <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back. Here's a live overview of your organization,
          employee attendance, payroll progress and recent activities.
        </p>
      </section>

      {loadError || !data ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {loadError ?? "Dashboard metrics are unavailable."}
        </p>
      ) : (
        <>
          <KPICards data={data} />

          <section className="grid gap-6 xl:grid-cols-6">
            <div className="xl:col-span-4">
              <AttendanceChart data={data.weeklyAttendance} />
            </div>

            <div className="xl:col-span-2">
              <QuickActions />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-4">
            <div className="xl:col-span-3">
              <RecentEmployees employees={data.recentHires} />
            </div>

            <div className="xl:col-span-1">
              <RecentActivity />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
