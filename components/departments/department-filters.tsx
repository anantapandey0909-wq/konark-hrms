"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  DepartmentStatusFilter,
} from "@/types/department";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentFiltersProps {
  readonly search: string;
  readonly onSearchChange: (search: string) => void;

  readonly status: DepartmentStatusFilter;
  readonly onStatusChange: (
    status: DepartmentStatusFilter
  ) => void;
}

export function DepartmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: DepartmentFiltersProps) {
  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(event.target.value);
    },
    [onSearchChange]
  );

  const handleStatusChange = React.useCallback(
    (value: string) => {
      onStatusChange(value as DepartmentStatusFilter);
    },
    [onStatusChange]
  );

  return (
    <section
      className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Department Filters"
    >
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          placeholder="Search by department name or code..."
          value={search}
          onChange={handleSearchChange}
          className="pl-9"
          aria-label="Search departments"
        />
      </div>

      <Select
        value={status}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger
          className="w-[180px]"
          aria-label="Filter departments by status"
        >
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            All Statuses
          </SelectItem>

          <SelectItem value="ACTIVE">
            Active Only
          </SelectItem>

          <SelectItem value="INACTIVE">
            Inactive Only
          </SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
}