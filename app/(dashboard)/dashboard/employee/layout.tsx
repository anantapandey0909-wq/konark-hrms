import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";

/**
 * Server layout for /dashboard/employee/**.
 * Enforces EMPLOYEE role on every subtree page (not client ProtectedRoute).
 * Mock portal content is unchanged.
 */
export default async function EmployeeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "EMPLOYEE") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
