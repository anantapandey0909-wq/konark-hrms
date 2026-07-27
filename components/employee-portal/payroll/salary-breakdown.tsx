"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { formatINR } from "@/lib/payroll/formatters";

interface EarningItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface SalaryBreakdownProps {
  readonly earnings: readonly EarningItem[];
}

export function SalaryBreakdown({ earnings }: SalaryBreakdownProps) {
  const safeFormat = (val: number) => {
    try {
      return formatINR(val);
    } catch {
      return `₹${val.toLocaleString("en-IN")}`;
    }
  };

  const totalEarnings = earnings.reduce((accum, curr) => accum + curr.amount, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Coins className="h-4 w-4 text-slate-400" />
          Earnings Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {earnings.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-0 last:pb-0 dark:border-slate-850">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {item.name}
              </div>
              <div className="text-[10px] text-slate-400">{item.category}</div>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {safeFormat(item.amount)}
            </div>
          </div>
        ))}
        
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 font-semibold text-xs">
          <span className="text-slate-500">Gross Earnings</span>
          <span className="text-slate-900 dark:text-slate-50 font-bold">{safeFormat(totalEarnings)}</span>
        </div>
      </CardContent>
    </Card>
  );
}