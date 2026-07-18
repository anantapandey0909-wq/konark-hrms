"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DEPARTMENT_STATUS_VALUES,
  DEPARTMENT_SORT_FIELDS,
  DEPARTMENT_SORT_ORDERS,
} from "@/types/department";
import type {
  DepartmentFilters as IDepartmentFilters,
  DepartmentStatus,
  DepartmentSortField,
  DepartmentSortOrder,
} from "@/types/department";

interface DepartmentFiltersProps {
  filters: IDepartmentFilters;
  onFiltersChange: (filters: IDepartmentFilters) => void;
  className?: string;
}

export const DEFAULT_DEPARTMENT_FILTERS: IDepartmentFilters = {
  search: "",
  status: "ALL",
  parentDepartment: "ALL",
  sortBy: "name",
  sortOrder: "asc",
};

const statusLabels: Record<DepartmentStatus | "ALL", string> = {
  ALL: "All Statuses",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const sortFieldLabels: Record<DepartmentSortField, string> = {
  name: "Name",
  code: "Code",
  employeeCount: "Employee Count",
  budget: "Budget",
  createdAt: "Created Date",
};

const sortOrderLabels: Record<DepartmentSortOrder, string> = {
  asc: "Ascending",
  desc: "Descending",
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export function DepartmentFilters({
  filters,
  onFiltersChange,
  className,
}: DepartmentFiltersProps) {
  const handleUpdate = <K extends keyof IDepartmentFilters>(
    key: K,
    value: IDepartmentFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const isResetDisabled = 
    filters.search === DEFAULT_DEPARTMENT_FILTERS.search &&
    filters.status === DEFAULT_DEPARTMENT_FILTERS.status &&
    filters.sortBy === DEFAULT_DEPARTMENT_FILTERS.sortBy &&
    filters.sortOrder === DEFAULT_DEPARTMENT_FILTERS.sortOrder;

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col gap-4 p-4 rounded-xl border border-muted/60 bg-muted/20 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-col flex-1 gap-3 sm:flex-row sm:items-center">
        {/* Search input field */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" aria-hidden="true" />
          <Input
            value={filters.search}
            onChange={(e) => handleUpdate("search", e.target.value)}
            placeholder="Search departments by name, code or manager..."
            className="pl-9 pr-4 rounded-xl border-muted/60 bg-background"
            aria-label="Search departments"
          />
        </div>

        {/* Status select field */}
        <div className="w-full sm:w-[160px]">
          <Select
            value={filters.status}
            onValueChange={(val) => handleUpdate("status", val as DepartmentStatus | "ALL")}
          >
            <SelectTrigger className="w-full rounded-xl border-muted/60 bg-background" aria-label="Filter by status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Statuses</SelectItem>
              {DEPARTMENT_STATUS_VALUES.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Sort field select */}
        <div className="w-full sm:w-[160px]">
          <Select
            value={filters.sortBy}
            onValueChange={(val) => handleUpdate("sortBy", val as DepartmentSortField)}
          >
            <SelectTrigger className="w-full rounded-xl border-muted/60 bg-background" aria-label="Sort by field">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {DEPARTMENT_SORT_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {sortFieldLabels[field]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort order select */}
        <div className="w-full sm:w-[140px]">
          <Select
            value={filters.sortOrder}
            onValueChange={(val) => handleUpdate("sortOrder", val as DepartmentSortOrder)}
          >
            <SelectTrigger className="w-full rounded-xl border-muted/60 bg-background" aria-label="Sort order direction">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {DEPARTMENT_SORT_ORDERS.map((order) => (
                <SelectItem key={order} value={order}>
                  {sortOrderLabels[order]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset filters button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onFiltersChange(DEFAULT_DEPARTMENT_FILTERS)}
          disabled={isResetDisabled}
          className="rounded-xl border-muted/60 text-muted-foreground hover:text-foreground shrink-0"
          title="Reset Filters"
          aria-label="Reset all active filters"
        >
          <RotateCcw className="h-4.5 w-4.5" />
        </Button>
      </div>
    </motion.div>
  );
}