"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SlidersHorizontal } from "lucide-react";

interface BalanceItem {
  id: string;
  type: "CASUAL" | "SICK" | "ANNUAL" | "COMPENSATORY";
  name: string;
  allocated: number;
  used: number;
  pending: number;
  color: string;
}

interface LeaveBalanceProps {
  readonly balances: readonly BalanceItem[];
}

export function LeaveBalance({ balances }: LeaveBalanceProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {balances.map((item) => {
          const available = item.allocated - item.used;
          const usagePercentage = (item.used / item.allocated) * 100;

          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
                <span className="text-slate-500">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {available}
                  </span>{" "}
                  / {item.allocated} Available
                </span>
              </div>
              <Progress value={usagePercentage} className="h-1.5" />
              {item.pending > 0 && (
                <div className="text-[10px] text-amber-600 dark:text-amber-500 text-right font-semibold">
                  {item.pending} day pending approval
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}