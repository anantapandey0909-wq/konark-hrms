import * as React from "react";
import { cn } from "@/lib/utils";
import type { SupportStatus } from "@/types/support";

interface SupportStatusBadgeProps {
  status: SupportStatus;
  className?: string;
}

export const SUPPORT_STATUS_CONFIG: Record<
  SupportStatus,
  {
    label: string;
    classes: string;
    dotClasses: string;
  }
> = {
  OPEN: {
    label: "Open",
    classes:
      "bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
    dotClasses: "bg-blue-500",
  },

  IN_PROGRESS: {
    label: "In Progress",
    classes:
      "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    dotClasses: "bg-amber-500",
  },

  WAITING_FOR_EMPLOYEE: {
    label: "Waiting",
    classes:
      "bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50",
    dotClasses: "bg-purple-500",
  },

  RESOLVED: {
    label: "Resolved",
    classes:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
    dotClasses: "bg-emerald-500",
  },

  CLOSED: {
    label: "Closed",
    classes:
      "bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700",
    dotClasses: "bg-zinc-500",
  },
};

export function SupportStatusBadge({
  status,
  className,
}: SupportStatusBadgeProps) {
  const config = SUPPORT_STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
        config.classes,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          config.dotClasses
        )}
      />
      {config.label}
    </span>
  );
}