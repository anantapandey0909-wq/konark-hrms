"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createPayrollSchema, type CreatePayrollFormData } from "@/schemas/payroll";
import type { Employee } from "@/types/employee";
import { PayrollBasicInfo } from "./payroll-basic-info";
import { PayrollAttendanceSection } from "./payroll-attendance-section";
import { PayrollLeaveSection } from "./payroll-leave-section";
import { PayrollSalarySection } from "./payroll-salary-section";
import { PayrollNotesSection } from "./payroll-notes-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";

interface PayrollFormProps {
  defaultValues?: Partial<CreatePayrollFormData>;
  employees: Employee[];
  loading?: boolean;
  submitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (data: CreatePayrollFormData) => void | Promise<void>;
  onCancel: () => void;
}

const defaultPayrollValues: CreatePayrollFormData = {
  payrollNumber: "",
  employeeId: "",
  employeeCode: "",
  employeeName: "",
  department: "Engineering",
  designation: "",
  month: "JULY",
  year: new Date().getFullYear(),
  status: "DRAFT",
  payPeriodStart: "",
  payPeriodEnd: "",
  generatedAt: "",
  paidAt: undefined,
  notes: "",
  attendanceSummary: {
    workingDays: 0,
    presentDays: 0,
    absentDays: 0,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    overtimeHours: 0,
    lateEntries: 0,
  },
  leaveSummary: {
    totalLeaves: 0,
    paidLeaves: 0,
    unpaidLeaves: 0,
    leaveWithoutPayDays: 0,
  },
  salaryBreakdown: {
    basicSalary: 0,
    grossSalary: 0,
    taxableIncome: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    netSalary: 0,
    allowances: [],
    deductions: [],
  },
};

export function PayrollForm({
  defaultValues,
  employees,
  loading = false,
  submitting = false,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
}: PayrollFormProps) {
  const mergedValues = useMemo<CreatePayrollFormData>(() => {
    return {
      ...defaultPayrollValues,
      ...defaultValues,
      attendanceSummary: {
        ...defaultPayrollValues.attendanceSummary,
        ...defaultValues?.attendanceSummary,
      },
      leaveSummary: {
        ...defaultPayrollValues.leaveSummary,
        ...defaultValues?.leaveSummary,
      },
      salaryBreakdown: {
        ...defaultPayrollValues.salaryBreakdown,
        ...defaultValues?.salaryBreakdown,
        allowances: defaultValues?.salaryBreakdown?.allowances ?? defaultPayrollValues.salaryBreakdown.allowances,
        deductions: defaultValues?.salaryBreakdown?.deductions ?? defaultPayrollValues.salaryBreakdown.deductions,
      },
    };
  }, [defaultValues]);

  const form = useForm<CreatePayrollFormData>({
    resolver: zodResolver(createPayrollSchema),
    defaultValues: mergedValues,
  });

  const isFormDisabled = loading || submitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PayrollBasicInfo form={form} employees={employees} loading={isFormDisabled} />

        <PayrollAttendanceSection form={form} loading={isFormDisabled} />

        <PayrollLeaveSection form={form} loading={isFormDisabled} />

        <PayrollSalarySection form={form} loading={isFormDisabled} />

        <PayrollNotesSection form={form} loading={isFormDisabled} />

        <Separator />

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isFormDisabled}
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            disabled={isFormDisabled}
          >
            {submitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
