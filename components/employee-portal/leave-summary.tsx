"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LeaveBalance } from "@/types/employee-portal";

interface LeaveSummaryProps {
  readonly balances: readonly LeaveBalance[];
}

export function LeaveSummary({ balances }: LeaveSummaryProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
          Leave Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {balances.map((leave) => {
          const available = leave.allocated - leave.used;
          const usagePercentage = (leave.used / leave.allocated) * 100;

          return (
            <div key={leave.type} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{leave.label}</span>
                <span className="text-slate-500">
                  <span className="font-semibold text-slate-900 dark:text-slate-50">{available}</span> / {leave.allocated} Available
                </span>
              </div>
              <Progress value={usagePercentage} className="h-1.5" />
              {leave.pending > 0 && (
                <div className="text-[10px] text-amber-600 dark:text-amber-500 text-right font-medium">
                  {leave.pending} request pending approval
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}