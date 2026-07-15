"use client";

import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ReportsDepartmentFilterProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

interface DepartmentOption {
  readonly value: string;
  readonly label: string;
}

const DEPARTMENT_OPTIONS: readonly DepartmentOption[] = [
  { value: "all", label: "All Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "support", label: "Customer Support" },
  { value: "legal", label: "Legal" },
  { value: "admin", label: "Administration" },
  { value: "it", label: "Information Technology" },
] as const;

export function ReportsDepartmentFilter({
  value,
  onValueChange,
  disabled = false,
  className,
}: ReportsDepartmentFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-9 w-full sm:w-[220px] gap-2 text-sm font-medium focus:ring-1 focus:ring-ring focus:ring-offset-0",
          className
        )}
      >
        <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <SelectValue placeholder="Department" />
      </SelectTrigger>
      <SelectContent>
        {DEPARTMENT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}