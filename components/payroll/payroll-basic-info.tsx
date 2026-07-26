import * as React from "react";
import { Info } from "lucide-react";
import { PayrollRecord } from "@/types/payroll";
import { formatMonthName } from "@/lib/payroll/formatters";
import { PayrollStatusBadge } from "./payroll-status-badge";

export function PayrollBasicInfo({ record }: { readonly record: PayrollRecord }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-900">
        <Info className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Payroll Cycle Details</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-slate-500">Payroll Number</span>
          <p className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">{record.payrollNumber}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500">Pay Cycle</span>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {formatMonthName(record.month)} {record.year}
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-500">Status</span>
          <div className="mt-1">
            <PayrollStatusBadge status={record.status} />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Pay Period</span>
          <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-1 whitespace-nowrap">
            {new Date(record.payPeriodStart).toLocaleDateString()} - {new Date(record.payPeriodEnd).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}