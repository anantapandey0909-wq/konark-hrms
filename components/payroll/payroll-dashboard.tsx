"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus, Upload, Download, DollarSign, Calendar, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayrollFiltersComponent } from "./payroll-filters";
import { PayrollTable } from "./payroll-table";
import { PayrollFilters, PayrollRecord } from "@/types/payroll";
import { mockPayrollRecords } from "@/mock/payroll";
import { mockDepartments } from "@/mock/department";

export function PayrollDashboard() {
  const [filters, setFilters] = useState<PayrollFilters>({
    search: "",
    department: "ALL",
    status: "ALL",
    month: "ALL",
    year: "ALL",
  });
const [isLoading] = useState(false);

  // Memoized Event Handlers for Header Quick Actions
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

  // Memoized Event Handlers for Payroll Actions
  const handleViewDetails = useCallback((record: PayrollRecord) => {
    toast.info("Payroll Details", {
      description: `Viewing details for ${record.employeeName} (${record.payrollNumber}).`,
    });
  }, []);

  const handleEdit = useCallback((record: PayrollRecord) => {
    toast.info("Coming Soon", {
      description: `Editing functionality for draft ${record.employeeName} is coming soon.`,
    });
  }, []);

  const handleApprove = useCallback((record: PayrollRecord) => {
    toast.success("Success", {
      description: `Approved payroll for ${record.employeeName}.`,
    });
  }, []);

  const handlePay = useCallback((record: PayrollRecord) => {
    toast.success("Success", {
      description: `Disbursed salary payment to ${record.employeeName}.`,
    });
  }, []);

  const handleCancel = useCallback((record: PayrollRecord) => {
    toast.warning("Cancelled", {
      description: `Cancelled payroll record for ${record.employeeName}.`,
    });
  }, []);

  // Handler for state mutations passed to the filter component
  const handleFilterChange = useCallback((updatedFilters: PayrollFilters) => {
    setFilters(updatedFilters);
  }, []);

  // Reset to specified base parameters
  const handleReset = useCallback(() => {
    setFilters({
      search: "",
      department: "ALL",
      status: "ALL",
      month: "ALL",
      year: "ALL",
    });
  }, []);

  // Memoized enterprise-grade filtering
  const filteredRecords = useMemo(() => {
    return mockPayrollRecords.filter((record: PayrollRecord) => {
      // Search matches employeeName, employeeCode, or payrollNumber
      const query = filters.search.trim().toLowerCase();
      const matchesSearch = !query ||
        record.employeeName.toLowerCase().includes(query) ||
        record.employeeCode.toLowerCase().includes(query) ||
        record.payrollNumber.toLowerCase().includes(query);

      // Department filter
      const matchesDepartment = filters.department === "ALL" ||
        record.department.id === filters.department.id;

      // Status filter
      const matchesStatus = filters.status === "ALL" ||
        record.status === filters.status;

      // Month filter
      const matchesMonth = filters.month === "ALL" ||
        record.month === filters.month;

      // Year filter
      const matchesYear = filters.year === "ALL" ||
        record.year === filters.year;

      return matchesSearch && matchesDepartment && matchesStatus && matchesMonth && matchesYear;
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="mb-2 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Payroll Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage payroll generation, approvals, salary processing, and employee compensation across your organization.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            asChild
            variant="default"
            aria-label="Generate new payroll run"
          >
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll Expense</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,45,200.00</div>
            <p className="text-xs text-slate-500">+4.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cycle</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">October 2025</div>
            <p className="text-xs text-slate-500">Processing current period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Employees</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142 / 142</div>
            <p className="text-xs text-slate-500">100% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Ready</div>
            <p className="text-xs text-slate-500">All batches calculated</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <PayrollFiltersComponent
        filters={filters}
        departments={mockDepartments}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Payroll Table */}
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