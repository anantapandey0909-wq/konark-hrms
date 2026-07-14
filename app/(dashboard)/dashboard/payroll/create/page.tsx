"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PayrollForm } from "@/components/payroll/payroll-form";
import { mockEmployees } from "@/mock/employee";
import type { CreatePayrollFormData } from "@/schemas/payroll";

export default function CreatePayrollPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    data: CreatePayrollFormData
  ): Promise<void> => {
    setSubmitting(true);

    try {
      // Temporary mock submit
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Create Payroll", data);

      router.push("/dashboard/payroll");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    router.push("/dashboard/payroll");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create Payroll
        </h1>

        <p className="text-muted-foreground mt-2">
          Generate a new payroll record for an employee.
        </p>
      </div>

      <PayrollForm
        employees={mockEmployees}
        loading={submitting}
        submitting={submitting}
        submitLabel="Create Payroll"
        cancelLabel="Cancel"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
