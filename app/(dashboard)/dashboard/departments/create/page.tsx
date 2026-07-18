"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DepartmentForm } from "@/components/departments/department-form";
import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";
import type { DepartmentFormData } from "@/types/department";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set the document title dynamically on client mount to bypass Next.js Client Component metadata restrictions
  useEffect(() => {
    document.title = "Create Department | Konark HRMS";
  }, []);
const handleSubmit = async (values: DepartmentFormData) => {
  void values;

  setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/departments");
    } catch (error) {
      console.error("Failed to submit department form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/departments");
  };

  return (
    <main className="container py-6 space-y-6" id="main-content">
      <div className="space-y-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          New Department
        </h1>
        <p className="text-sm text-muted-foreground">
          Establish a new corporate division, allocate initial financial budgets, and appoint leaders.
        </p>
      </div>

      <DepartmentForm
        mode="create"
        employees={mockEmployees}
        departments={mockDepartments}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </main>
  );
}