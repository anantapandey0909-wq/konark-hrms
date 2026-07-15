"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ReportsDateFilter } from "./reports-date-filter";
import { ReportsDepartmentFilter } from "./reports-department-filter";
import { ReportsExportButton } from "./reports-export-button";

export interface ReportsFiltersProps {
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
  department?: string;
  onDepartmentChange?: (value: string) => void;
  dateRange?: string;
  onDateRangeChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ReportsFilters({
  searchQuery,
  onSearchQueryChange,
  department,
  onDepartmentChange,
  dateRange,
  onDateRangeChange,
  disabled = false,
  className,
}: ReportsFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            value={searchQuery ?? ""}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            disabled={disabled}
            className="h-9 pl-9 w-full focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
          />
        </div>

        {/* Reusable Department Select Filter */}
        <ReportsDepartmentFilter
          value={department}
          onValueChange={onDepartmentChange}
          disabled={disabled}
        />

        {/* Reusable Predefined Date Range Select Filter */}
        <ReportsDateFilter
          value={dateRange}
          onValueChange={onDateRangeChange}
          disabled={disabled}
        />
      </div>

      {/* Reusable Composition Export Button & Trigger Dialog */}
      <ReportsExportButton disabled={disabled} className="self-end sm:self-auto" />
    </div>
  );
}