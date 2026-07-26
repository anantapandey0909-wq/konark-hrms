"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  readonly status: string;
  readonly onStatusChange: (status: string) => void;
}

export function DepartmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: DepartmentFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by department name or code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-3">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active Only</SelectItem>
            <SelectItem value="INACTIVE">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}