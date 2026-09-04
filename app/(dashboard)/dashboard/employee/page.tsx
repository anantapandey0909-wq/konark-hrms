import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmployeeDashboard } from "@/components/employee-portal/employee-dashboard";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Employee Portal | Konark HRMS",
  description:
    "Self-service dashboard for employee profiles, attendance, leaves, and configuration.",
};

/**
 * Server Component — Employee portal is role-gated (EMPLOYEE only).
 * Unauthenticated → /login. Wrong role → /unauthorized.
 * Portal remains mock/demo data; this gate is route protection only.
 */
export default async function EmployeePortalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "EMPLOYEE") {
    redirect("/unauthorized");
  }

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeDashboard />
    </main>
  );
}
