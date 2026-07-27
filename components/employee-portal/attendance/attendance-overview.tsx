"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck2, Clock, CalendarX2, Percent } from "lucide-react";

interface OverviewData {
  daysPresent: number;
  daysAbsent: number;
  daysOnLeave: number;
  holidays: number;
  averageHoursLogged: string;
  complianceRate: number;
}

interface AttendanceOverviewProps {
  readonly data: OverviewData;
}

export function AttendanceOverview({ data }: AttendanceOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CalendarCheck2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Total Days Present
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {data.daysPresent} Days
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
            <CalendarX2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Leaves Approved
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {data.daysOnLeave} Days
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-sky-50 p-3 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Average Login Time
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {data.averageHoursLogged}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              Monthly Compliance
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
              {data.complianceRate}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}