"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PayrollStatsCards } from "./payroll-stats-cards";
import { PayrollFilters as PayrollFiltersComponent } from "./payroll-filters";
import { PayrollTable } from "./payroll-table";
import {
  mockPayrollRecords,
  mockPayrollSummary,
  mockPayrollStats,
} from "@/mock/payroll";
import type { PayrollFilters, PayrollRecord } from "@/types/payroll";

export default function PayrollDashboard() {
  const [filters, setFilters] = useState<PayrollFilters>({
    search: "",
    department: "ALL",
    status: "ALL",
    month: "ALL",
    year: "ALL",
  });

  const filteredData = useMemo<PayrollRecord[]>(() => {
    return mockPayrollRecords.filter((record) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch =
          record.employeeName?.toLowerCase().includes(query) ||
          record.employeeCode?.toLowerCase().includes(query) ||
          record.payrollNumber?.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      if (filters.department !== "ALL") {
        if (record.department !== filters.department) return false;
      }

      if (filters.status !== "ALL") {
        if (record.status !== filters.status) return false;
      }

      if (filters.month !== "ALL") {
        if (record.month !== filters.month) return false;
      }

      if (filters.year !== "ALL") {
        if (record.year !== filters.year) return false;
      }

      return true;
    });
  }, [filters]);


  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Payroll Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage payroll records, salary processing and employee payroll history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="w-full sm:w-auto">
  <Link
    href="/dashboard/payroll/create"
    aria-label="Generate Payroll"
  >
    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
    Generate Payroll
  </Link>
</Button>
        </div>
      </div>

      <Separator />

      <PayrollStatsCards 
        summary={mockPayrollSummary} 
        stats={mockPayrollStats} 
      />

      <PayrollFiltersComponent 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      <PayrollTable 
      
  data={filteredData}
      />
    </div>
  );
}
