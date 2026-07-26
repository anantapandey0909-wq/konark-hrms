import * as React from "react";
import { Clock } from "lucide-react";
import { PayrollRecord } from "@/types/payroll";

export function PayrollLeaveSummary({ record }: { readonly record: PayrollRecord }) {
  const lve = record.leaveSummary;

  const items = [
    { label: "Total Leaves", value: lve.totalLeaves },
    { label: "Paid Leaves", value: lve.paidLeaves },
    { label: "Unpaid Leaves", value: lve.unpaidLeaves },
    { label: "LWP Days", value: lve.leaveWithoutPayDays },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-900">
        <Clock className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Leave Summary</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{item.label}</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}