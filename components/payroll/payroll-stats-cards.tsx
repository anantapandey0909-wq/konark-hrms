import * as React from "react";
import { TrendingUp, Users, CreditCard, DollarSign } from "lucide-react";
import { formatINR } from "@/lib/payroll/formatters";
import { PayrollStats } from "@/types/payroll";

export function PayrollStatsCards({ stats }: { readonly stats: PayrollStats }) {
  const items = [
    {
      title: "Active Employees",
      value: stats.employeeCount,
      icon: Users,
      desc: "Total payroll active count",
    },
    {
      title: "Total Net Disbursed",
      value: formatINR(stats.totalNetSalary),
      icon: CreditCard,
      desc: "Net compensation outflow",
    },
    {
      title: "Gross Salary Outflow",
      value: formatINR(stats.totalGrossSalary),
      icon: TrendingUp,
      desc: "Including taxes and allowances",
    },
    {
      title: "Average Net Salary",
      value: formatINR(stats.averageNetSalary),
      icon: DollarSign,
      desc: "Per-employee net payout mean",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {item.title}
            </span>
            <item.icon className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{item.value}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}