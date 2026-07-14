import type { ChangeEvent } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Department } from "@/types/employee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  PayrollFilters as PayrollFiltersType,
  PayrollStatus,
  PayrollMonth,
} from "@/types/payroll";
import { formatPayrollMonth, formatPayrollStatus } from "@/lib/payroll";
import { cn } from "@/lib/utils";

export interface PayrollFiltersProps {
  filters: PayrollFiltersType;
  onFiltersChange: (filters: PayrollFiltersType) => void;
  className?: string;
}

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
] as const;

const STATUSES: PayrollStatus[] = ["DRAFT", "PENDING", "APPROVED", "PAID", "CANCELLED"];

const MONTHS: PayrollMonth[] = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const YEARS = [2023, 2024, 2025, 2026];

export function PayrollFilters({
  filters,
  onFiltersChange,
  className,
}: PayrollFiltersProps) {
  
  // Reusable unified filter state updater
  const updateFilter = <K extends keyof PayrollFiltersType>(
  key: K,
  value: PayrollFiltersType[K]
) => {

    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFilter("search", e.target.value);
  };

  const handleDepartmentChange = (value: string) => {
  updateFilter(
    "department",
    value === "ALL"
      ? "ALL"
      : (value as Department)
  );
};

  const handleStatusChange = (value: string) => {
    updateFilter("status", value === "ALL" ? "ALL" : (value as PayrollStatus));
  };

  const handleMonthChange = (value: string) => {
    updateFilter("month", value === "ALL" ? "ALL" : (value as PayrollMonth));
  };

  const handleYearChange = (value: string) => {
    updateFilter("year", value === "ALL" ? "ALL" : Number(value));
  };

  const hasActiveFilters =
    (filters.search && filters.search.trim().length > 0) ||
    (filters.department && filters.department !== "ALL") ||
    (filters.status && filters.status !== "ALL") ||
    (filters.month && filters.month !== "ALL") ||
    (filters.year && filters.year !== "ALL");

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      department: "ALL",
      status: "ALL",
      month: "ALL",
      year: "ALL",
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm md:flex-row md:items-center",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by employee name or payroll number..."
          value={filters.search ?? ""}
          onChange={handleSearchChange}
          className="pl-9 h-10 w-full"
        />
      </div>

      {/* Select Filter Controls */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        {/* Department Filter */}
        <Select value={filters.department ?? "ALL"} onValueChange={handleDepartmentChange}>
          <SelectTrigger className="w-full sm:w-[150px] h-10">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Departments</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status ?? "ALL"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[140px] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {formatPayrollStatus(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month Filter */}
        <Select value={filters.month ?? "ALL"} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-full sm:w-[140px] h-10">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Months</SelectItem>
            {MONTHS.map((month) => (
              <SelectItem key={month} value={month}>
                {formatPayrollMonth(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select value={String(filters.year ?? "ALL")} onValueChange={handleYearChange}>
          <SelectTrigger className="w-full sm:w-[110px] h-10">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Years</SelectItem>
            {YEARS.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="col-span-2 sm:col-span-1 h-10 px-3 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 shrink-0"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}
