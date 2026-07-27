"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShieldAlert, CheckSquare, Coins } from "lucide-react";
import { formatINR } from "@/lib/payroll/formatters";

interface OverviewProps {
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
}

interface PayrollOverviewProps {
  readonly data: OverviewProps;
}

export function PayrollOverview({ data }: PayrollOverviewProps) {
  // Graceful formatting fallbacks
  const safeFormat = (val: number) => {
    try {
      return formatINR(val);
    } catch {
      return `₹${val.toLocaleString("en-IN")}`;
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Gross Earning ({data.month} {data.year})
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {safeFormat(data.grossSalary)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Total Deductions
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {safeFormat(data.deductions)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm sm:col-span-2 lg:col-span-1">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Disbursed Net Pay
            </div>
            <div className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400 mt-0.5">
              {safeFormat(data.netSalary)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}