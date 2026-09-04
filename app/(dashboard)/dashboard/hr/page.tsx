import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HRDashboard } from "@/components/hr-portal/hr-dashboard";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "HR Dashboard | Konark HRMS",
  description:
    "Human Resources dashboard for employee management, attendance, leave approvals and workforce operations.",
};

/**
 * Server Component — HR portal is role-gated (HR only).
 * Unauthenticated → /login. Wrong role → /unauthorized.
 * Portal remains mock/demo data; this gate is route protection only.
 */
export default async function HRDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HR") {
    redirect("/unauthorized");
  }

  return <HRDashboard />;
}
