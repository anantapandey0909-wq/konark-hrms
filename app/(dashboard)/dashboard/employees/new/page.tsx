"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { EmployeeForm } from "@/components/employee/form/employee-form";
import type { EmployeeFormData } from "@/components/employee/form/employee-form";
import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";

export default function NewEmployeePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (values: EmployeeFormData) => {
    setSubmitting(true);
    try {
      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Successfully Created Employee Record:", values);
      router.push("/dashboard/employees");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/employees");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Add Employee</h1>
        <p className="text-sm text-muted-foreground">
          Register a new employee profile to the active workspace organization.
        </p>
      </div>

      <EmployeeForm
        mode="create"
        departments={mockDepartments}
        managers={mockEmployees}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}