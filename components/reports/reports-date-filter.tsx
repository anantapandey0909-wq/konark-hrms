"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ReportsDateFilterProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

interface DateOption {
  value: string;
  label: string;
}

const dateFilterOptions: DateOption[] = [
  { value: "today", label: "Today" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "last-90-days", label: "Last 90 Days" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "this-year", label: "This Year" },
  { value: "custom-range", label: "Custom Range" },
];

export function ReportsDateFilter({
  value,
  onValueChange,
  disabled = false,
  className,
}: ReportsDateFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-9 w-full sm:w-[200px] gap-2 text-sm font-medium focus:ring-1 focus:ring-ring focus:ring-offset-0",
          className
        )}
      >
        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <SelectValue placeholder="Reporting Period" />
      </SelectTrigger>
      <SelectContent>
        {dateFilterOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}