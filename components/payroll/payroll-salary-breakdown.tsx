import * as React from "react";
import { CreditCard } from "lucide-react";
import { PayrollRecord } from "@/types/payroll";
import { formatINR } from "@/lib/payroll/formatters";

export function PayrollSalaryBreakdown({ record }: { readonly record: PayrollRecord }) {
  const sb = record.salaryBreakdown;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-900">
        <CreditCard className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Salary Breakdown</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Allowances */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Earnings & Allowances</h4>
          <div className="space-y-2 border-t border-slate-100 pt-2 dark:border-slate-900">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Basic Salary</span>
              <span className="font-semibold">{formatINR(sb.basicSalary)}</span>
            </div>
            {sb.allowances.map((alw) => (
              <div key={alw.id} className="flex justify-between text-sm">
                <span className="text-slate-500">{alw.name}</span>
                <span className="font-medium">{formatINR(alw.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-dashed border-slate-200 pt-2 dark:border-slate-800">
              <span>Gross Salary</span>
              <span>{formatINR(sb.grossSalary)}</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deductions</h4>
          <div className="space-y-2 border-t border-slate-100 pt-2 dark:border-slate-900">
            {sb.deductions.map((ded) => (
              <div key={ded.id} className="flex justify-between text-sm">
                <span className="text-slate-500">{ded.name}</span>
                <span className="font-medium text-rose-600">-{formatINR(ded.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-dashed border-slate-200 pt-2 dark:border-slate-800">
              <span>Total Deductions</span>
              <span className="text-rose-600">-{formatINR(sb.totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-900">
        <div>
          <span className="text-xs text-slate-500">Taxable Income</span>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{formatINR(sb.taxableIncome)}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-slate-500">Net Disbursed Amount</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatINR(sb.netSalary)}</p>
        </div>
      </div>
    </div>
  );
}