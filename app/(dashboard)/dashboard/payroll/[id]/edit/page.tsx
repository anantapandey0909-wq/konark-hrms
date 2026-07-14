"use client";

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { useState } from "react";

import { PayrollForm } from "@/components/payroll/payroll-form";
import { mockEmployees } from "@/mock/employee";
import { getPayrollById } from "@/mock/payroll";

import type { CreatePayrollFormData } from "@/schemas/payroll";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PayrollEditPage({ params }: PageProps) {
  const { id } = use(params);

  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const payroll = getPayrollById(id);

  if (!payroll) {
    notFound();
  }

  const handleSubmit = async (
    data: CreatePayrollFormData
  ): Promise<void> => {
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Updated Payroll:", data);

      router.push(`/payroll/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    router.push(`/payroll/${id}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Payroll
        </h1>

        <p className="mt-2 text-muted-foreground">
          Update payroll information.
        </p>
      </div>

      <PayrollForm
        employees={mockEmployees}
        defaultValues={payroll}
        loading={submitting}
        submitting={submitting}
        submitLabel="Save Changes"
        cancelLabel="Cancel"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}