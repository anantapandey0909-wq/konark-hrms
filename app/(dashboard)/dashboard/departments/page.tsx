import type { Metadata } from "next";

import { DepartmentDashboard } from "@/components/departments/department-dashboard";
import {
  mockDepartments,
  mockDepartmentSummary,
} from "@/mock/department";

export const metadata: Metadata = {
  title: "Departments | Konark HRMS",
  description:
    "Manage departments, organizational hierarchy, managers, and workforce structure.",
};

export default function DepartmentsPage() {
  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <DepartmentDashboard
        initialDepartments={mockDepartments}
        summary={mockDepartmentSummary}
      />
    </main>
  );
}