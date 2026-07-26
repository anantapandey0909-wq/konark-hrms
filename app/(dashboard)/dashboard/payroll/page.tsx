"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollForm, PayrollFormData } from "@/components/payroll/payroll-form";

export default function CreatePayrollPage() {
  const router = useRouter();

  const handleSubmit = async (data: PayrollFormData) => {
    if (data) {
      router.push("/dashboard/payroll");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="-ml-3 h-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payroll List
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Generate Payroll Record
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create a new payroll cycle computation for an employee.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <PayrollForm 
          mode="create" 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  );
}