"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PayrollForm, PayrollFormData } from "@/components/payroll/payroll-form";
import { savePayroll } from "@/lib/data/payroll";
import { fetchEmployees } from "@/lib/data/employees";

export default function CreatePayrollPage() {
  const router = useRouter();

  const handleSubmit = async (data: PayrollFormData) => {
    try {
      // Resolve employee by code/name when form does not carry a real DB id
      let employeeId = data.employeeId;
      const employees = await fetchEmployees({
        search: data.employeeCode || data.employeeName,
      });
      const match =
        employees.find(
          (e) =>
            e.id === data.employeeId ||
            e.employeeId === data.employeeCode ||
            `${e.firstName} ${e.lastName}`.toLowerCase() ===
              data.employeeName.trim().toLowerCase()
        ) ?? employees[0];

      if (match) {
        employeeId = match.id;
      }

      if (!employeeId || employeeId.startsWith("emp-")) {
        // Random form placeholder — require a resolvable employee
        if (!match) {
          throw new Error(
            "Could not resolve employee. Enter a valid employee code from your organization."
          );
        }
        employeeId = match.id;
      }

      await savePayroll({
        employeeId,
        month: data.month,
        year: data.year,
        status: data.status,
        payPeriodStart: data.payPeriodStart,
        payPeriodEnd: data.payPeriodEnd,
        basicSalary: data.basicSalary,
        totalAllowances: data.totalAllowances,
        totalDeductions: data.totalDeductions,
        grossSalary: data.grossSalary,
        netSalary: data.netSalary,
        taxableIncome: data.taxableIncome,
        notes: data.notes,
      });

      toast.success("Payroll generated.");
      router.push("/dashboard/payroll");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate payroll."
      );
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/payroll");
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
