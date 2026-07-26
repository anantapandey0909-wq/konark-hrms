"use client";

// ============================================================================
// Imports
// ============================================================================

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================================
// Types
// ============================================================================

export interface AttendanceFilterState {
  readonly search: string;
  readonly status: string;
  readonly workMode: string;
}

interface AttendanceFiltersProps {
  readonly filters: AttendanceFilterState;
  readonly onFiltersChange: (filters: AttendanceFilterState) => void;
}

interface FilterOption {
  readonly value: string;
  readonly label: string;
}

interface FilterSelectProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly placeholder: string;
  readonly options: readonly FilterOption[];
  readonly ariaLabel: string;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_OPTIONS: readonly FilterOption[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "PRESENT", label: "Present" },
  { value: "LATE", label: "Late" },
  { value: "HALF_DAY", label: "Half Day" },
  { value: "ABSENT", label: "Absent" },
  { value: "ON_LEAVE", label: "On Leave" },
] as const;

const WORK_MODE_OPTIONS: readonly FilterOption[] = [
  { value: "ALL", label: "All Modes" },
  { value: "OFFICE", label: "Office" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * A highly reusable, accessible Select filter wrapper.
 * Enables rapid addition of new filters (e.g., Department, Location)
 * with zero code duplication while preserving full shadcn/ui styling.
 */
function FilterSelect({
  value,
  onValueChange,
  placeholder,
  options,
  ariaLabel,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[160px]" aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================================================
// Component
// ============================================================================

export function AttendanceFilters({ filters, onFiltersChange }: AttendanceFiltersProps) {
  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({
        ...filters,
        search: e.target.value,
      });
    },
    [filters, onFiltersChange]
  );

  const handleStatusChange = React.useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value,
      });
    },
    [filters, onFiltersChange]
  );

  const handleWorkModeChange = React.useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        workMode: value,
      });
    },
    [filters, onFiltersChange]
  );

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
      {/* Search Filter input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by employee name..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-9"
          aria-label="Search by employee name"
        />
      </div>

      {/* Select Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          value={filters.status}
          onValueChange={handleStatusChange}
          placeholder="Filter Status"
          options={STATUS_OPTIONS}
          ariaLabel="Filter by status"
        />

        <FilterSelect
          value={filters.workMode}
          onValueChange={handleWorkModeChange}
          placeholder="Work Mode"
          options={WORK_MODE_OPTIONS}
          ariaLabel="Filter by work mode"
        />
      </div>
    </div>
  );
}