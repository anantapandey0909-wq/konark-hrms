"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Info, ShieldCheck } from "lucide-react";

interface ShiftConfig {
  name: string;
  timings: string;
  gracePeriod: string;
  breakDuration: string;
  weeklyOffs: string;
}

interface ShiftInformationProps {
  readonly shift: ShiftConfig;
}

export function ShiftInformation({ shift }: ShiftInformationProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          Shift Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div>
          <div className="text-xs text-slate-400">Assigned Shift</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            {shift.name}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400">Timings</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              {shift.timings}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Grace Limit</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              {shift.gracePeriod}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400">Weekly Off</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              {shift.weeklyOffs}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Break Period</div>
            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">
              {shift.breakDuration}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 text-[10px] text-slate-500 border border-slate-100/50 dark:bg-slate-900/30 dark:border-slate-800/50">
          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Attendance validations are calculated based on these configuration standards. Regularizations must be requested for missed clocking metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}