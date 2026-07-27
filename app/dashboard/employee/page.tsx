import type { Metadata } from "next";
import * as React from "react";
import { EmployeeDashboard } from "@/components/employee-portal/employee-dashboard";

export const metadata: Metadata = {
  title: "Employee Portal | Konark HRMS",
  description: "Self-service dashboard for employee profiles, attendance, leaves, and configuration.",
};

export default function EmployeePortalPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeDashboard />
    </div>
  );
}