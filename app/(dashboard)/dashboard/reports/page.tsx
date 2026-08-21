import type { Metadata } from "next";
import { ReportsDashboard } from "@/components/reports/reports-dashboard";
import { fetchReportsDashboard } from "@/lib/data/reports";
import type { ReportsDashboardData } from "@/lib/services/reports.service";

export const metadata: Metadata = {
  title: "Reports | Konark HRMS",
  description:
    "View enterprise HR reports, analytics, and workforce insights.",
};

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  let data: ReportsDashboardData | null = null;
  let loadError: string | null = null;

  try {
    data = await fetchReportsDashboard();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Failed to load reports data.";
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      {loadError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      )}
      {data && <ReportsDashboard data={data} />}
      {!data && !loadError && (
        <div className="text-sm text-muted-foreground">No report data.</div>
      )}
    </main>
  );
}
