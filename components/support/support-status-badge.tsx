import * as React from "react";
import { cn } from "@/lib/utils";
import type { SupportStatus } from "@/types/support";

interface SupportStatusBadgeProps {
  status: SupportStatus;
  className?: string;
}

const statusConfig: Record<
  SupportStatus,
  { label: string; classes: string; dotClasses: string }
> = {
  OPEN: {
    label: "Open",
    classes: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/50",
    dotClasses: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    classes: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/50",
    dotClasses: "bg-amber-500",
  },
  WAITING_FOR_EMPLOYEE: {
    label: "Waiting for Employee",
    classes: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/50",
    dotClasses: "bg-purple-500",
  },
  RESOLVED: {
    label: "Resolved",
    classes: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/50",
    dotClasses: "bg-emerald-500",
  },
  CLOSED: {
    label: "Closed",
    classes: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/50",
    dotClasses: "bg-zinc-400 dark:bg-zinc-500",
  },
};

export function SupportStatusBadge({ status, className }: SupportStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    classes: "bg-zinc-100 text-zinc-600 border-zinc-200",
    dotClasses: "bg-zinc-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors select-none",
        config.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClasses)} />
      {config.label}
    </span>
  );
}