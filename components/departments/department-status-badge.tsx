import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DepartmentStatus } from "@/types/department";

interface DepartmentStatusBadgeProps {
  status: DepartmentStatus;
  className?: string;
}

const labelMap: Record<DepartmentStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const statusStyles: Record<DepartmentStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
  INACTIVE: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900/50",
};

export function DepartmentStatusBadge({
  status,
  className,
}: DepartmentStatusBadgeProps) {
  const currentLabel = labelMap[status] ?? status;
  const currentStyle = statusStyles[status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium px-2.5 py-0.5 text-xs rounded-full transition-colors select-none",
        currentStyle,
        className
      )}
    >
      {currentLabel}
    </Badge>
  );
}