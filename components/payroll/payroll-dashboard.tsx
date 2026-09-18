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
  ChevronLeft,
  ChevronRight,
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

const DEFAULT_PAGE_SIZE = 10;

interface PayrollDashboardProps {
  readonly initialRecords: PayrollRecord[];
  readonly initialTotal: number;
  readonly initialPage: number;
  readonly initialPageSize: number;
  readonly initialStats: PayrollStats | null;
  readonly initialDepartments: ResolvedDepartment[];
}

function filtersToQuery(
  nextFilters: PayrollFilters,
  page: number,
  pageSize: number
) {
  const departmentId =
    nextFilters.department === "ALL"
      ? undefined
      : nextFilters.department.id;
  return {
    search: nextFilters.search || undefined,
    status: nextFilters.status === "ALL" ? undefined : nextFilters.status,
    month: nextFilters.month === "ALL" ? undefined : nextFilters.month,
    year: nextFilters.year === "ALL" ? undefined : nextFilters.year,
    departmentId,
    page,
    pageSize,
  };
}

export function PayrollDashboard({
  initialRecords,
  initialTotal,
  initialPage,
  initialPageSize,
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
  const [totalItems, setTotalItems] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize || DEFAULT_PAGE_SIZE);
  const [stats, setStats] = useState<PayrollStats | null>(initialStats);
  const [departments] = useState<ResolvedDepartment[]>(initialDepartments);
  const [isPending, startTransition] = useTransition();

  const reload = useCallback(
    (nextFilters: PayrollFilters, page: number) => {
      startTransition(async () => {
        try {
          const [listResult, dash] = await Promise.all([
            fetchPayrollRecords(
              filtersToQuery(nextFilters, page, pageSize)
            ),
            fetchPayrollStats(),
          ]);
          setRecords(listResult.items);
          setTotalItems(listResult.total);
          setCurrentPage(listResult.page);
          setStats(dash.stats);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to reload payroll."
          );
        }
      });
    },
    [pageSize]
  );

  const loadPage = useCallback(
    (page: number, nextFilters: PayrollFilters) => {
      startTransition(async () => {
        try {
          const listResult = await fetchPayrollRecords(
            filtersToQuery(nextFilters, page, pageSize)
          );
          setRecords(listResult.items);
          setTotalItems(listResult.total);
          setCurrentPage(listResult.page);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load payroll."
          );
        }
      });
    },
    [pageSize]
  );

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
        reload(filters, currentPage);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to approve payroll."
        );
      }
    },
    [filters, currentPage, reload]
  );

  const handlePay = useCallback(
    async (record: PayrollRecord) => {
      try {
        await patchPayroll(record.id, { status: "PAID" });
        toast.success("Success", {
          description: `Disbursed salary payment to ${record.employeeName}.`,
        });
        reload(filters, currentPage);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to mark as paid."
        );
      }
    },
    [filters, currentPage, reload]
  );

  const handleCancel = useCallback(
    async (record: PayrollRecord) => {
      try {
        await patchPayroll(record.id, { status: "CANCELLED" });
        toast.warning("Cancelled", {
          description: `Cancelled payroll record for ${record.employeeName}.`,
        });
        reload(filters, currentPage);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to cancel payroll."
        );
      }
    },
    [filters, currentPage, reload]
  );

  const handleFilterChange = useCallback(
    (updatedFilters: PayrollFilters) => {
      setFilters(updatedFilters);
      setCurrentPage(1);
      reload(updatedFilters, 1);
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
    setCurrentPage(1);
    reload(base, 1);
  }, [reload]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startRecordIndex =
    totalItems === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endRecordIndex = Math.min(activePage * pageSize, totalItems);

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    loadPage(next, filters);
  };

  const totalExpense = stats?.totalNetSalary ?? 0;
  const processed = stats?.employeeCount ?? 0;

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
            <p className="text-xs text-slate-500">
              All non-cancelled payroll records
            </p>
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
            <p className="text-xs text-slate-500">Non-cancelled payroll records</p>
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

      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
          <span className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {startRecordIndex}
            </span>
            –
            <span className="font-semibold text-foreground">
              {endRecordIndex}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span>{" "}
            records
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage <= 1 || isPending}
              aria-label="Go to previous page"
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground tabular-nums px-1">
              Page {activePage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage >= totalPages || isPending}
              aria-label="Go to next page"
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayrollDashboard;
