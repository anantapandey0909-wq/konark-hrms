import React from "react";
import { Badge } from "@/components/ui/badge";
import { LeaveStatus } from "@/types/leave";
import { LEAVE_STATUS_LABELS } from "@/constants/leave";

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
}

interface StatusConfig {
  variant: "outline" | "secondary";
  className: string;
}

const BASE_CLASSES = "font-semibold text-xs py-0.5 px-2.5 border rounded-full transition-colors shrink-0 w-fit";

const STATUS_MAP: Record<LeaveStatus, StatusConfig> = {
  PENDING: {
    variant: "outline",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30",
  },
  APPROVED: {
    variant: "outline",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30",
  },
  REJECTED: {
    variant: "outline",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30",
  },
  CANCELLED: {
    variant: "outline",
    className: "bg-slate-50 text-slate-600 dark:bg-slate-950/20 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/30",
  },
};

export default function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const config = STATUS_MAP[status];
  const label = LEAVE_STATUS_LABELS[status];

  return (
    <Badge 
      variant={config.variant} 
      className={`${BASE_CLASSES} ${config.className}`}
    >
      {label}
    </Badge>
  );
}