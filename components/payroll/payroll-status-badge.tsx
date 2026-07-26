import * as React from "react";
import { PayrollStatus } from "@/types/payroll";

export function PayrollStatusBadge({ status }: { readonly status: PayrollStatus }) {
  const classesMap: Record<PayrollStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-900/40 dark:text-slate-400 dark:ring-slate-500/20",
    PENDING: "bg-amber-50 text-amber-800 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-500 dark:ring-amber-500/20",
    APPROVED: "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30",
    PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
    CANCELLED: "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
  };

  const labelMap: Record<PayrollStatus, string> = {
    DRAFT: "Draft",
    PENDING: "Pending",
    APPROVED: "Approved",
    PAID: "Paid",
    CANCELLED: "Cancelled",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${classesMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}