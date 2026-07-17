import type { Metadata } from "next";
import ReportsDashboard from "@/components/reports/reports-dashboard";

export const metadata: Metadata = {
  title: "Reports | Konark HRMS",
  description:
    "View enterprise HR reports, analytics, and workforce insights.",
};

export default function ReportsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <ReportsDashboard />
    </main>
  );
}