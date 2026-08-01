import type { Metadata } from "next";
import { HRDashboard } from "@/components/hr-portal/hr-dashboard";

export const metadata: Metadata = {
  title: "HR Dashboard | Konark HRMS",
  description:
    "Human Resources dashboard for employee management, attendance, leave approvals and workforce operations.",
};

export default function HRDashboardPage() {
  return <HRDashboard />;
}