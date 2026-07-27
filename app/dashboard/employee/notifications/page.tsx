import * as React from "react";
import type { Metadata } from "next";
import { EmployeeNotifications } from "@/components/employee-portal/notifications/employee-notifications";

export const metadata: Metadata = {
  title: "Notifications | Konark HRMS",
  description: "Employee notifications, calendar, events, and announcements.",
};

export default function EmployeeNotificationsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeNotifications />
    </div>
  );
}