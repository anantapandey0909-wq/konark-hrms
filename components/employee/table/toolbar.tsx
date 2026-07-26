"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmployeeStatus, EmploymentType } from "@/types/employee";
import { EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from "@/types/employee";
import type { Department } from "@/types/department";

export interface EmployeeFilters {
  search: string;
  departmentId: string | "ALL";
  status: EmployeeStatus | "ALL";
  employmentType: EmploymentType | "ALL";
}

interface EmployeeTableToolbarProps {
  filters: EmployeeFilters;
  setFilters: React.Dispatch<React.SetStateAction<EmployeeFilters>>;
  departments: Department[];
  className?: string;
}

export function EmployeeTableToolbar({
  filters,
  setFilters,
  departments,
  className,
}: EmployeeTableToolbarProps) {
  const isFiltered = 
    filters.search !== "" || 
    filters.departmentId !== "ALL" || 
    filters.status !== "ALL" || 
    filters.employmentType !== "ALL";

  const handleReset = () => {
    setFilters({
      search: "",
      departmentId: "ALL",
      status: "ALL",
      employmentType: "ALL",
    });
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full", className)}>
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search employees..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-9 rounded-xl border-muted/60 h-9"
          />
        </div>

        {/* Department Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.departmentId}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, departmentId: val }))}
          >
            <SelectTrigger className="rounded-xl border-muted/60 h-9">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type Filter */}
        <div className="w-full sm:w-44">
          <Select
            value={filters.employmentType}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, employmentType: val as EmploymentType | "ALL" }))}
          >
            <SelectTrigger className="rounded-xl border-muted/60 h-9">
              <SelectValue placeholder="All Classifications" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Types</SelectItem>
              {EMPLOYMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  <span className="capitalize">{type.replace("_", " ").toLowerCase()}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.status}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, status: val as EmployeeStatus | "ALL" }))}
          >
            <SelectTrigger className="rounded-xl border-muted/60 h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Statuses</SelectItem>
              {EMPLOYEE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  <span className="capitalize">{status.replace("_", " ").toLowerCase()}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Action Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="rounded-xl h-9 px-3 gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0 w-full sm:w-auto"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>
    </div>
  );
}