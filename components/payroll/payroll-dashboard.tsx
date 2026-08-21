"use client";

import { useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Upload,
  Download,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayrollFiltersComponent } from "./payroll-filters";
import { PayrollTable } from "./payroll-table";
import {
  PayrollFilters,
  PayrollRecord,
  PayrollStats,
} from "@/types/payroll";
import {
  fetchPayrollRecords,
  fetchPayrollStats,
  patchPayroll,
} from "@/lib/data/payroll";
import type { ResolvedDepartment } from "@/types/department";
import { formatCurrency } from "@/lib/payroll";

interface PayrollDashboardProps {
  readonly initialRecords: PayrollRecord[];
  readonly initialStats: PayrollStats | null;
  readonly initialDepartments: ResolvedDepartment[];
}

export function PayrollDashboard({
  initialRecords,
  initialStats,
  initialDepartments,
}: PayrollDashboardProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<PayrollFilters>({
    search: "",
    department: "ALL",
    status: "ALL",
    month: "ALL",
    year: "ALL",
  });
  const [records, setRecords] = useState<PayrollRecord[]>(initialRecords);
  const [stats, setStats] = useState<PayrollStats | null>(initialStats);
  const [departments] = useState<ResolvedDepartment[]>(initialDepartments);
  const [isPending, startTransition] = useTransition();

  const reload = useCallback((nextFilters: PayrollFilters) => {
    startTransition(async () => {
      try {
        const departmentId =
          nextFilters.department === "ALL"
            ? undefined
            : nextFilters.department.id;
        const [rows, dash] = await Promise.all([
          fetchPayrollRecords({
            search: nextFilters.search || undefined,
            status:
              nextFilters.status === "ALL" ? undefined : nextFilters.status,
            month: nextFilters.month === "ALL" ? undefined : nextFilters.month,
            year: nextFilters.year === "ALL" ? undefined : nextFilters.year,
            departmentId,
          }),
          fetchPayrollStats(),
        ]);
        setRecords(rows);
        setStats(dash.stats);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to reload payroll."
        );
      }
    });
  }, []);

  const handleUploadSalary = useCallback(() => {
    toast.info("Coming Soon", {
      description: "Salary upload will be available in a future update.",
    });
  }, []);

  const handleExport = useCallback(() => {
    toast.info("Coming Soon", {
      description: "Export functionality will be available in a future update.",
    });
  }, []);

  const handleViewDetails = useCallback(
    (record: PayrollRecord) => {
      router.push(`/dashboard/payroll/${record.id}`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (record: PayrollRecord) => {
      router.push(`/dashboard/payroll/${record.id}/edit`);
    },
    [router]
  );

  const handleApprove = useCallback(
    async (record: PayrollRecord) => {
      try {
        await patchPayroll(record.id, { status: "APPROVED" });
        toast.success("Success", {
          description: `Approved payroll for ${record.employeeName}.`,
        });
        reload(filters);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to approve payroll."
        );
      }
    },
    [filters, reload]
  );

  const handlePay = useCallback(
    async (record: PayrollRecord) => {
      try {
        await patchPayroll(record.id, { status: "PAID" });
        toast.success("Success", {
          description: `Disbursed salary payment to ${record.employeeName}.`,
        });
        reload(filters);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to mark as paid."
        );
      }
    },
    [filters, reload]
  );

  const handleCancel = useCallback(
    async (record: PayrollRecord) => {
      try {
        await patchPayroll(record.id, { status: "CANCELLED" });
        toast.warning("Cancelled", {
          description: `Cancelled payroll record for ${record.employeeName}.`,
        });
        reload(filters);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to cancel payroll."
        );
      }
    },
    [filters, reload]
  );

  const handleFilterChange = useCallback(
    (updatedFilters: PayrollFilters) => {
      setFilters(updatedFilters);
      reload(updatedFilters);
    },
    [reload]
  );

  const handleReset = useCallback(() => {
    const base: PayrollFilters = {
      search: "",
      department: "ALL",
      status: "ALL",
      month: "ALL",
      year: "ALL",
    };
    setFilters(base);
    reload(base);
  }, [reload]);

  const totalExpense = stats?.totalNetSalary ?? 0;
  const processed = stats?.employeeCount ?? records.length;

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="mb-2 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Payroll Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage payroll generation, approvals, salary processing, and employee
            compensation across your organization.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button asChild variant="default" aria-label="Generate new payroll run">
            <Link href="/dashboard/payroll/create">
              <Plus className="mr-2 h-4 w-4" />
              Generate Payroll
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={handleUploadSalary}
            aria-label="Upload salary data configuration"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Salary
          </Button>

          <Button
            variant="ghost"
            onClick={handleExport}
            aria-label="Export complete payroll data"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payroll Expense
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpense, "en-IN", "INR")}
            </div>
            <p className="text-xs text-slate-500">Net salaries in scope</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cycle</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <p className="text-xs text-slate-500">Current calendar period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processed Employees
            </CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processed}</div>
            <p className="text-xs text-slate-500">Payroll records loaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {isPending ? "Loading" : "Ready"}
            </div>
            <p className="text-xs text-slate-500">
              {isPending ? "Refreshing payroll data…" : "All batches calculated"}
            </p>
          </CardContent>
        </Card>
      </div>

      <PayrollFiltersComponent
        filters={filters}
        departments={departments}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <PayrollTable
        records={records}
        isLoading={isPending}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onApprove={handleApprove}
        onPay={handlePay}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default PayrollDashboard;
