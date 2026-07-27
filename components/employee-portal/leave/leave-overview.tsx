"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, ShieldAlert, CheckSquare, Sparkles } from "lucide-react";

interface OverviewMetrics {
  totalAllocated: number;
  totalUsed: number;
  totalPending: number;
  totalAvailable: number;
}

interface LeaveOverviewProps {
  readonly overview: OverviewMetrics;
}

export function LeaveOverview({ overview }: LeaveOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Yearly Quota
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {overview.totalAllocated} Days
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Leaves Applied/Used
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {overview.totalUsed} Days
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
              Pending Approvals
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {overview.totalPending} Days
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-teal-50 p-3 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Net Balance
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {overview.totalAvailable} Days
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}