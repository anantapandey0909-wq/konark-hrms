import type { Metadata } from "next";
import { SettingsDashboard } from "@/components/settings/settings-dashboard";

export const metadata: Metadata = {
  title: "Settings | Konark HRMS",
  description:
    "Configure company, organization, attendance, leave, payroll, security, notification, appearance, and system preferences.",
};

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <SettingsDashboard />
    </main>
  );
}