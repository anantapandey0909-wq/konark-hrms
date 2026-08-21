"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PayrollMonth, PayrollStatus } from "@/types/payroll";
import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";
import { fetchEmployees } from "@/lib/data/employees";
import { fetchDepartments } from "@/lib/data/departments";

export interface PayrollFormData {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentId: string;
  designation: string;
  month: PayrollMonth;
  year: number;
  status: PayrollStatus;
  payPeriodStart: string;
  payPeriodEnd: string;
  basicSalary: number;
  grossSalary: number;
  taxableIncome: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  notes?: string;
}

export interface PayrollFormProps {
  readonly mode: "create" | "edit";
  readonly onSubmit: (data: PayrollFormData) => void | Promise<void>;
  readonly defaultValues?: Partial<PayrollFormData>;
  readonly isSubmitting?: boolean;
  readonly onCancel?: () => void;
  readonly className?: string;
}

const MONTH_OPTIONS: readonly { label: string; value: PayrollMonth }[] = [
  { label: "January", value: "JANUARY" },
  { label: "February", value: "FEBRUARY" },
  { label: "March", value: "MARCH" },
  { label: "April", value: "APRIL" },
  { label: "May", value: "MAY" },
  { label: "June", value: "JUNE" },
  { label: "July", value: "JULY" },
  { label: "August", value: "AUGUST" },
  { label: "September", value: "SEPTEMBER" },
  { label: "October", value: "OCTOBER" },
  { label: "November", value: "NOVEMBER" },
  { label: "December", value: "DECEMBER" },
];

const STATUS_OPTIONS: readonly { label: string; value: PayrollStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Approval", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Paid", value: "PAID" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function PayrollForm({
  mode,
  onSubmit,
  defaultValues,
  isSubmitting = false,
  onCancel,
  className,
}: PayrollFormProps) {
  const [formData, setFormData] = React.useState<PayrollFormData>({
    employeeId: defaultValues?.employeeId || "",
    employeeCode: defaultValues?.employeeCode || "",
    employeeName: defaultValues?.employeeName || "",
    departmentId: defaultValues?.departmentId || "",
    designation: defaultValues?.designation || "",
    month: defaultValues?.month || "JANUARY",
    year: defaultValues?.year || new Date().getFullYear(),
    status: defaultValues?.status || "DRAFT",
    payPeriodStart: defaultValues?.payPeriodStart
      ? defaultValues.payPeriodStart.substring(0, 10)
      : "",
    payPeriodEnd: defaultValues?.payPeriodEnd
      ? defaultValues.payPeriodEnd.substring(0, 10)
      : "",
    basicSalary: defaultValues?.basicSalary || 0,
    grossSalary: defaultValues?.grossSalary || 0,
    taxableIncome: defaultValues?.taxableIncome || 0,
    totalAllowances: defaultValues?.totalAllowances || 0,
    totalDeductions: defaultValues?.totalDeductions || 0,
    netSalary: defaultValues?.netSalary || 0,
    notes: defaultValues?.notes || "",
  });

  const [errors, setErrors] = React.useState<
    Partial<Record<keyof PayrollFormData, string>>
  >({});
  const [pending, setPending] = React.useState(false);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [listsLoading, setListsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setListsLoading(true);
      try {
        const [emps, depts] = await Promise.all([
          fetchEmployees({ status: "ACTIVE" }),
          fetchDepartments(),
        ]);
        if (!cancelled) {
          setEmployees(emps);
          setDepartments(depts);
        }
      } catch {
        if (!cancelled) {
          setEmployees([]);
          setDepartments([]);
        }
      } finally {
        if (!cancelled) setListsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedEmployee = employees.find((e) => e.id === formData.employeeId);
  const selectedDepartmentName =
    departments.find((d) => d.id === formData.departmentId)?.name ??
    (selectedEmployee
      ? departments.find((d) => d.id === selectedEmployee.departmentId)?.name
      : undefined) ??
    "";

  const handleEmployeeSelect = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;
    setFormData((prev) => ({
      ...prev,
      employeeId: emp.id,
      employeeCode: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`.trim(),
      designation: emp.designation,
      departmentId: emp.departmentId ?? "",
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.employeeId;
      delete next.employeeName;
      delete next.employeeCode;
      delete next.designation;
      delete next.departmentId;
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof PayrollFormData, string>> = {};

    if (!formData.employeeId.trim()) {
      nextErrors.employeeId = "Please select an employee";
    }
    if (!formData.payPeriodStart)
      nextErrors.payPeriodStart = "Start date is required";
    if (!formData.payPeriodEnd) nextErrors.payPeriodEnd = "End date is required";
    if (formData.basicSalary <= 0)
      nextErrors.basicSalary = "Basic salary must be greater than 0";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    field: keyof PayrollFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (
        field === "basicSalary" ||
        field === "totalAllowances" ||
        field === "totalDeductions"
      ) {
        const basic =
          field === "basicSalary" ? Number(value) : prev.basicSalary;
        const allowances =
          field === "totalAllowances" ? Number(value) : prev.totalAllowances;
        const deductions =
          field === "totalDeductions" ? Number(value) : prev.totalDeductions;

        updated.grossSalary = basic + allowances;
        updated.taxableIncome = Math.max(
          0,
          updated.grossSalary - deductions * 0.5
        );
        updated.netSalary = Math.max(0, updated.grossSalary - deductions);
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setPending(true);
    try {
      await onSubmit({
        ...formData,
        // Authoritative identity is employeeId; snapshot fields are display-only.
        employeeId: formData.employeeId,
      });
    } finally {
      setPending(false);
    }
  };

  const loading = isSubmitting || pending;
  const identityLocked = mode === "create" || Boolean(formData.employeeId);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ""}`}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Employee
          </label>
          <Select
            value={formData.employeeId || undefined}
            onValueChange={handleEmployeeSelect}
            disabled={loading || listsLoading || mode === "edit"}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  listsLoading
                    ? "Loading employees…"
                    : employees.length === 0
                      ? "No employees found"
                      : "Select an employee"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employeeId && (
            <p className="text-xs text-rose-600">{errors.employeeId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Employee Name
          </label>
          <Input
            value={formData.employeeName}
            readOnly={identityLocked}
            placeholder="Select an employee"
            disabled={loading}
            className={identityLocked ? "bg-slate-50 dark:bg-slate-900/40" : ""}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Employee Code
          </label>
          <Input
            value={formData.employeeCode}
            readOnly={identityLocked}
            placeholder="—"
            disabled={loading}
            className={identityLocked ? "bg-slate-50 dark:bg-slate-900/40" : ""}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Department
          </label>
          <Input
            value={selectedDepartmentName}
            readOnly
            placeholder="—"
            disabled={loading}
            className="bg-slate-50 dark:bg-slate-900/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Designation
          </label>
          <Input
            value={formData.designation}
            readOnly={identityLocked}
            placeholder="—"
            disabled={loading}
            className={identityLocked ? "bg-slate-50 dark:bg-slate-900/40" : ""}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Payroll Month
          </label>
          <Select
            value={formData.month}
            onValueChange={(val) => handleChange("month", val as PayrollMonth)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Payroll Year
          </label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) =>
              handleChange(
                "year",
                parseInt(e.target.value, 10) || new Date().getFullYear()
              )
            }
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pay Period Start
          </label>
          <Input
            type="date"
            value={formData.payPeriodStart}
            onChange={(e) => handleChange("payPeriodStart", e.target.value)}
            disabled={loading}
          />
          {errors.payPeriodStart && (
            <p className="text-xs text-rose-600">{errors.payPeriodStart}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pay Period End
          </label>
          <Input
            type="date"
            value={formData.payPeriodEnd}
            onChange={(e) => handleChange("payPeriodEnd", e.target.value)}
            disabled={loading}
          />
          {errors.payPeriodEnd && (
            <p className="text-xs text-rose-600">{errors.payPeriodEnd}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Basic Salary (INR)
          </label>
          <Input
            type="number"
            value={formData.basicSalary || ""}
            onChange={(e) =>
              handleChange("basicSalary", parseFloat(e.target.value) || 0)
            }
            placeholder="0"
            disabled={loading}
          />
          {errors.basicSalary && (
            <p className="text-xs text-rose-600">{errors.basicSalary}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Allowances (INR)
          </label>
          <Input
            type="number"
            value={formData.totalAllowances || ""}
            onChange={(e) =>
              handleChange("totalAllowances", parseFloat(e.target.value) || 0)
            }
            placeholder="0"
            disabled={loading}
          />
          <p className="text-[10px] text-slate-400">
            Preview only — server recalculates from allowance line items.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Deductions (INR)
          </label>
          <Input
            type="number"
            value={formData.totalDeductions || ""}
            onChange={(e) =>
              handleChange("totalDeductions", parseFloat(e.target.value) || 0)
            }
            placeholder="0"
            disabled={loading}
          />
          <p className="text-[10px] text-slate-400">
            Preview only — server recalculates from deduction line items.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Payroll Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(val) => handleChange("status", val as PayrollStatus)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Calculated Salary Breakdown
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <span className="text-xs text-slate-500">Gross Salary</span>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {"₹ "}{formData.grossSalary.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Taxable Income</span>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {"₹ "}{formData.taxableIncome.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Net Payable Salary</span>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {"₹ "}{formData.netSalary.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Notes / Remarks
        </label>
        <Input
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Optional payroll remarks..."
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || listsLoading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Generate Payroll" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
