import * as React from "react";
import { cn } from "@/lib/utils";
import type { SupportPriority } from "@/types/support";

interface SupportPriorityBadgeProps {
  priority: SupportPriority;
  className?: string;
}

const priorityConfig: Record<
  SupportPriority,
  { label: string; classes: string; barClasses: string }
> = {
  LOW: {
    label: "Low",
    classes: "bg-zinc-50 text-zinc-600 dark:bg-zinc-900/30 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800",
    barClasses: "bg-zinc-300 dark:bg-zinc-600",
  },
  MEDIUM: {
    label: "Medium",
    classes: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-150 dark:border-blue-900/40",
    barClasses: "bg-blue-400 dark:bg-blue-500",
  },
  HIGH: {
    label: "High",
    classes: "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200 dark:border-orange-900/40",
    barClasses: "bg-orange-500",
  },
  URGENT: {
    label: "Urgent",
    classes: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/40 font-semibold",
    barClasses: "bg-red-600 animate-pulse",
  },
};

export function SupportPriorityBadge({ priority, className }: SupportPriorityBadgeProps) {
  const config = priorityConfig[priority] || {
    label: priority,
    classes: "bg-zinc-50 text-zinc-600 border-zinc-200",
    barClasses: "bg-zinc-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded border transition-colors select-none",
        config.classes,
        className
      )}
    >
      <span className={cn("h-3.5 w-1 rounded-sm shrink-0", config.barClasses)} />
      {config.label}
    </span>
  );
}