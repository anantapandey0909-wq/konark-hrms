"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AttendanceSummary } from "@/types/employee-portal";
import { CalendarCheck2, Percent, Hourglass } from "lucide-react";

interface AttendanceSummaryProps {
  readonly summary: AttendanceSummary;
}

export function AttendanceSummaryCard({ summary }: AttendanceSummaryProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
          Time & Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarCheck2 className="h-4 w-4 text-slate-400" />
              <span className="text-xs">Weekly Compliance</span>
            </div>
            <div className="mt-1 text-lg font-bold tracking-tight">
              {summary.weeklyCompliancePercentage}%
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-500">
              <Percent className="h-4 w-4 text-slate-400" />
              <span className="text-xs">Monthly Score</span>
            </div>
            <div className="mt-1 text-lg font-bold tracking-tight">
              {summary.monthlyAttendanceRate}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Attendance Trend</span>
            <span className="font-semibold">{summary.monthlyAttendanceRate}%</span>
          </div>
          <Progress value={summary.monthlyAttendanceRate} className="h-2" />
        </div>

        <div className="flex items-start gap-2.5 rounded-lg bg-indigo-50/40 p-3 text-xs text-indigo-900 border border-indigo-100/30 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-950/40">
          <Hourglass className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Today's Timeline</div>
            <div className="mt-0.5 text-slate-500 dark:text-slate-400">
              {summary.todayFirstPunch ? (
                <>Punch-In: <span className="font-medium text-slate-700 dark:text-slate-300">{summary.todayFirstPunch}</span></>
              ) : (
                "Not clocked in yet. Complete punch validation to register today's timeline."
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}