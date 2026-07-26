import * as React from "react";
import { PayrollSummary } from "@/types/payroll";

export function PayrollSummaryCard({ summary }: { readonly summary: PayrollSummary }) {
  const segments = [
    { label: "Paid", value: summary.paidPayroll, color: "bg-emerald-500" },
    { label: "Pending", value: summary.pendingPayroll, color: "bg-amber-500" },
    { label: "Approved", value: summary.approvedPayroll, color: "bg-blue-500" },
    { label: "Draft", value: summary.draftPayroll, color: "bg-slate-500" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Payroll Records Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${seg.color}`} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{seg.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50">{seg.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}