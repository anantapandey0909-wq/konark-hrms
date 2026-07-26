"use client";

import * as React from "react";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PayrollFilters, PayrollStatus, PayrollMonth } from "@/types/payroll";
import { Department } from "@/types/department";

export interface PayrollFiltersProps {
  readonly filters: PayrollFilters;
  readonly departments: readonly Department[];
  readonly onFilterChange: (filters: PayrollFilters) => void;
  readonly onReset: () => void;
}

const STATUS_OPTIONS: readonly { readonly label: string; readonly value: PayrollStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Approval", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Paid", value: "PAID" },
  { label: "Cancelled", value: "CANCELLED" },
];

const MONTH_OPTIONS: readonly { readonly label: string; readonly value: PayrollMonth }[] = [
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

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS: readonly string[] = Array.from({ length: 5 }, (_, i) =>
  (CURRENT_YEAR - i).toString()
);

export function PayrollFiltersComponent({
  filters,
  departments,
  onFilterChange,
  onReset,
}: PayrollFiltersProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: event.target.value,
    });
  };

  const handleDepartmentChange = (value: string) => {
    if (value === "ALL") {
      onFilterChange({
        ...filters,
        department: "ALL",
      });
    } else {
      const selectedDept = departments.find((dept) => dept.id === value);
      if (selectedDept) {
        onFilterChange({
          ...filters,
          department: selectedDept,
        });
      }
    }
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value as "ALL" | PayrollStatus,
    });
  };

  const handleMonthChange = (value: string) => {
    onFilterChange({
      ...filters,
      month: value as "ALL" | PayrollMonth,
    });
  };

  const handleYearChange = (value: string) => {
    onFilterChange({
      ...filters,
      year: value === "ALL" ? "ALL" : parseInt(value, 10),
    });
  };

  const getDepartmentValue = (): string => {
    if (!filters.department || filters.department === "ALL") {
      return "ALL";
    }
    return filters.department.id;
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-900">
        <SlidersHorizontal className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Filter Payroll Records</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search employee or code..."
            className="pl-9"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <Select
          value={getDepartmentValue()}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.month}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Months</SelectItem>
            {MONTH_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <div className="flex-1">
            <Select
              value={filters.year.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Years</SelectItem>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            title="Reset Filters"
            aria-label="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}