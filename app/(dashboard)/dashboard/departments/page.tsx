import type { Metadata } from "next";

import { DepartmentDashboard } from "@/components/departments/department-dashboard";
import {
  fetchDepartments,
  fetchDepartmentSummary,
} from "@/lib/data/departments";
import {
  mockDepartments,
  mockDepartmentSummary,
} from "@/mock/department";
import { isRealDataEnabled } from "@/lib/config/flags";

export const metadata: Metadata = {
  title: "Departments | Konark HRMS",
  description:
    "Manage departments, organizational hierarchy, managers, and workforce structure.",
};

export default async function DepartmentsPage() {
  let departments = mockDepartments;
  let summary = mockDepartmentSummary;

  if (isRealDataEnabled()) {
    try {
      const [d, s] = await Promise.all([
        fetchDepartments(),
        fetchDepartmentSummary(),
      ]);
      departments = d;
      summary = s;
    } catch {
      // Fall back to mock if session/tenant unavailable (e.g. mock auth only)
      departments = mockDepartments;
      summary = mockDepartmentSummary;
    }
  }

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <DepartmentDashboard
        initialDepartments={departments}
        summary={summary}
      />
    </main>
  );
}
