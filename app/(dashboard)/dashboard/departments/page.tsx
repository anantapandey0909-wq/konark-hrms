"use client";

import * as React from "react";
import { mockDepartments, mockDepartmentSummary } from "@/mock/department";
import { DepartmentDashboard } from "@/components/departments/department-dashboard";

export default function DepartmentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DepartmentDashboard
        initialDepartments={mockDepartments}
        summary={mockDepartmentSummary}
      />
    </div>
  );
}