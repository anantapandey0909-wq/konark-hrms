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
import { DEFAULT_SUPPORT_FILTERS } from "@/lib/support-utils";
import type { SupportStatus, SupportPriority, SupportCategory, SupportFiltersState } from "@/types/support";

interface SupportFiltersProps {
  filters: SupportFiltersState;
  onFiltersChange: (filters: SupportFiltersState) => void;
}

export function SupportFilters({ filters, onFiltersChange }: SupportFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as SupportStatus | "ALL" });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({ ...filters, priority: value as SupportPriority | "ALL" });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value as SupportCategory | "ALL" });
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value as SupportFiltersState["sortBy"] });
  };

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({ ...filters, sortOrder: value as "asc" | "desc" });
  };

  const handleReset = () => {
    onFiltersChange(DEFAULT_SUPPORT_FILTERS);
  };

  const isFiltered =
    filters.search !== DEFAULT_SUPPORT_FILTERS.search ||
    filters.status !== DEFAULT_SUPPORT_FILTERS.status ||
    filters.priority !== DEFAULT_SUPPORT_FILTERS.priority ||
    filters.category !== DEFAULT_SUPPORT_FILTERS.category ||
    filters.sortBy !== DEFAULT_SUPPORT_FILTERS.sortBy ||
    filters.sortOrder !== DEFAULT_SUPPORT_FILTERS.sortOrder;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ticket number, subject or employee..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9 h-10 w-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:flex lg:items-center">
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10 w-full lg:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="h-10 w-full lg:w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-10 w-full lg:w-[150px] col-span-2 md:col-span-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="TECHNICAL">Technical</SelectItem>
              <SelectItem value="PAYROLL">Payroll</SelectItem>
              <SelectItem value="LEAVE">Leave & Attendance</SelectItem>
              <SelectItem value="IT_HARDWARE">IT Hardware</SelectItem>
              <SelectItem value="ONBOARDING">Onboarding</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-muted/50 pt-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Sorting engine and view options</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <span className="text-muted-foreground mr-1">Sort:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="priority">Priority Order</SelectItem>
              <SelectItem value="ticketNumber">Ticket Number</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 gap-1 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}