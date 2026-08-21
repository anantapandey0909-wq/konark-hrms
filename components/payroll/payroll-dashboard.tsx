"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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
import { fetchPayrollRecords, fetchPayrollStats, patchPayroll } from "@/lib/data/payroll";
import { fetchDepartments } from "@/lib/data/departments";
import type { ResolvedDepartment } from "@/types/department";
import { formatCurrency } from "@/lib/payroll";

export function PayrollDashboard() {
  const router = useRouter();
  const [filters, setFilters] = useState<PayrollFilters>({
    search: "",
    department: "ALL",
    status: "ALL",
    month: "ALL",
    year: "ALL",
  });
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [stats, setStats] = useState<PayrollStats | null>(null);
  const [departments, setDepartments] = useState<ResolvedDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const departmentId =
        filters.department === "ALL" ? undefined : filters.department.id;
      const [rows, dash, depts] = await Promise.all([
        fetchPayrollRecords({
          search: filters.search || undefined,
          status: filters.status === "ALL" ? undefined : filters.status,
          month: filters.month === "ALL" ? undefined : filters.month,
          year: filters.year === "ALL" ? undefined : filters.year,
          departmentId,
        }),
        fetchPayrollStats(),
        fetchDepartments(),
      ]);
      setRecords(rows);
      setStats(dash.stats);
      setDepartments(depts);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load payroll."
      );
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

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
        void load();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to approve payroll."
        );
      }
    },
    [load]
  );

  const handlePay = useCallback(
    async (record: PayrollRecord) => {
      try {
        await patchPayroll(record.id, { status: "PAID" });
        toast.success("Success", {
          description: `Disbursed salary payment to ${record.employeeName}.`,
        });
        void load();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to mark as paid."
        );
      }
    },
    [load]
  );

  const handleCancel = useCallback(
    async (record: PayrollRecord) => {
      try {
        await patchPayroll(record.id, { status: "CANCELLED" });
        toast.warning("Cancelled", {
          description: `Cancelled payroll record for ${record.employeeName}.`,
        });
        void load();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to cancel payroll."
        );
      }
    },
    [load]
  );

  const handleFilterChange = useCallback((updatedFilters: PayrollFilters) => {
    setFilters(updatedFilters);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({
      search: "",
      department: "ALL",
      status: "ALL",
      month: "ALL",
      year: "ALL",
    });
  }, []);

  // Client-side refine still runs on the already server-filtered set
  const filteredRecords = useMemo(() => records, [records]);

  const totalExpense = stats?.totalNetSalary ?? 0;
  const processed = stats?.employeeCount ?? filteredRecords.length;

  return (
    <div className="space-y-8">
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

      {loadError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      )}

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
              {isLoading ? "Loading" : "Ready"}
            </div>
            <p className="text-xs text-slate-500">
              {isLoading ? "Fetching payroll data…" : "All batches calculated"}
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
        records={filteredRecords}
        isLoading={isLoading}
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
