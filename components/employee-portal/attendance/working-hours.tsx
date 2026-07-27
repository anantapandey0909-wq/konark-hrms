"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Hourglass } from "lucide-react";

interface HoursBreakdown {
  regularHours: number;
  overtimeHours: number;
  underTimeHours: number;
}

interface WorkingHoursProps {
  readonly hours: HoursBreakdown;
}

export function WorkingHours({ hours }: WorkingHoursProps) {
  const totalInvoiced = hours.regularHours + hours.overtimeHours;
  const overtimePercentage = (hours.overtimeHours / totalInvoiced) * 100;
  const undertimePercentage = (hours.underTimeHours / totalInvoiced) * 100;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Hourglass className="h-4 w-4 text-slate-400" />
          Hours Aggregation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-slate-50/50 p-2 dark:bg-slate-900/30">
            <div className="text-[10px] text-slate-400 font-medium">Regular</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {hours.regularHours}h
            </div>
          </div>
          <div className="rounded bg-emerald-50/50 p-2 dark:bg-emerald-950/10">
            <div className="text-[10px] text-emerald-600 font-medium">Overtime</div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
              {hours.overtimeHours}h
            </div>
          </div>
          <div className="rounded bg-rose-50/50 p-2 dark:bg-rose-950/10">
            <div className="text-[10px] text-rose-600 font-medium">Shortage</div>
            <div className="text-sm font-bold text-rose-700 dark:text-rose-400 mt-0.5">
              {hours.underTimeHours}h
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Overtime Contribution</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {overtimePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={overtimePercentage} className="h-1 bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Under-time Impact</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {undertimePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={undertimePercentage} className="h-1 bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}