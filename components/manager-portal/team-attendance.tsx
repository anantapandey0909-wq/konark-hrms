"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AttendanceSummary } from '@/types/manager-portal';
import { AttendanceChart } from './attendance-chart';
import { CalendarRange, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TeamAttendanceProps {
  readonly summary: AttendanceSummary;
}

export function TeamAttendance({ summary }: TeamAttendanceProps) {
  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-indigo-500" />
          <span>Team Attendance Summary</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Daily active hours and punctuality metrics for this pay cycle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Attendance %</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">
              {summary.attendancePercentage}%
            </p>
            <Progress value={summary.attendancePercentage} className="h-1 bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Avg Hours</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">
              {summary.averageHoursPerDay} hrs
            </p>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">Target 8.0 hrs met</span>
          </div>

          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Late Check-Ins</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">
              {summary.lateRatePercentage}%
            </p>
            <Progress value={summary.lateRatePercentage} className="h-1 bg-amber-100 dark:bg-amber-950/40" />
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
            Daily Trend History
          </p>
          <AttendanceChart trendData={summary.trendData} />
        </div>
      </CardContent>
    </Card>
  );
}