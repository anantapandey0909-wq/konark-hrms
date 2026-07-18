"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
import { DepartmentForm } from "@/components/departments/department-form";
import { getDepartmentById, mockDepartments } from "@/mock/department";
import { mockEmployees } from "@/mock/employee";
import type { DepartmentFormData } from "@/types/department";

interface PageProps {
  params: Promise<{
    departmentId: string;
  }>;
}

export default function EditDepartmentPage({ params }: PageProps) {
  const { departmentId } = React.use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const department = getDepartmentById(departmentId);

  if (!department) {
    notFound();
  }

  // Set client document title dynamically on client mount to bypass Next.js Client Component metadata restrictions
  useEffect(() => {
    if (department) {
      document.title = `Edit Department | ${department.name}`;
    }
  }, [department]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/dashboard/departments/${departmentId}`);
    } catch (error) {
      console.error("Failed to update department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/departments/${departmentId}`);
  };

  const initialFormData: Partial<DepartmentFormData> = {
    code: department.code,
    name: department.name,
    description: department.description,
    status: department.status,
    parentDepartmentId: department.parentDepartmentId,
    headEmployeeId: department.headEmployeeId,
    managerEmployeeId: department.managerEmployeeId,
    allocatedBudget: department.budget.allocated,
  };

  return (
    <main className="container py-6 space-y-6" id="main-content">
      <div className="space-y-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Department
        </h1>
        <p className="text-sm text-muted-foreground">
          Update the profile details, financial allocations, or leadership roles for {department.name}.
        </p>
      </div>

      <DepartmentForm
        mode="edit"
        defaultValues={initialFormData}
        employees={mockEmployees}
        departments={mockDepartments}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </main>
  );
}