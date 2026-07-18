import type { Metadata } from "next";
import { DepartmentDashboard } from "@/components/departments/department-dashboard";
import { mockDepartments, mockDepartmentSummary } from "@/mock/department";

export const metadata: Metadata = {
  title: "Departments | Konark HRMS",
  description: "Manage departments, department heads, managers, budgets, employees, and organizational structure.",
};

export default function DepartmentsPage() {
  return (
    <main className="container py-6 space-y-6" id="main-content">
      <DepartmentDashboard
        departments={mockDepartments}
        summary={mockDepartmentSummary}
        loading={false}
      />
    </main>
  );
}