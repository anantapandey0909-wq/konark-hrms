import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ManagerDashboard } from "@/components/manager-portal/manager-dashboard";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Manager Dashboard — Konark HRMS",
  description:
    "Enterprise Manager Portal workspace to manage direct reports, approve requests, and monitor KPIs.",
};

/**
 * Server Component — Manager portal is role-gated (MANAGER only).
 * Unauthenticated → /login. Wrong role → /unauthorized.
 * Portal remains mock/demo data; this gate is route protection only.
 */
export default async function ManagerPortalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "MANAGER") {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4 max-w-7xl mx-auto px-4 md:px-6">
      <ManagerDashboard />
    </div>
  );
}
