import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsDashboard } from "@/components/settings/settings-dashboard";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPermissions } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Settings | Konark HRMS",
  description:
    "Configure company, organization, attendance, leave, payroll, security, notification, appearance, and system preferences.",
};

/**
 * Server Component — enforces ROLE_PERMISSIONS.settings (ADMIN only).
 * Does not rely on sidebar visibility. Unauthorized users → /unauthorized.
 */
export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const allowed =
    user.isSuperAdmin === true || getPermissions(user.role).settings === true;

  if (!allowed) {
    redirect("/unauthorized");
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <SettingsDashboard />
    </main>
  );
}
