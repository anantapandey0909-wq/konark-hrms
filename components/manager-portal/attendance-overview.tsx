"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AttendanceSummary } from '@/types/manager-portal';
import { AttendanceChart } from './attendance-chart';
import { CalendarRange, Clock } from 'lucide-react';

interface AttendanceOverviewProps {
  readonly summary: AttendanceSummary;
}

export function AttendanceOverview({ summary }: AttendanceOverviewProps) {
  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-indigo-500" />
          <span>Attendance Analytics</span>
        </CardTitle>
        <CardDescription className="text-xs">Aggregate parameters and daily punctuality diagnostics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-xl">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Attendance Rate</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{summary.attendancePercentage}%</p>
            <Progress value={summary.attendancePercentage} className="h-1 bg-slate-100 dark:bg-slate-800 mt-2.5" />
          </div>

          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-xl">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avg Shift Hours</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary.averageHoursPerDay} hrs</p>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3 text-emerald-500" /> Standard 8.0 hrs target
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Late Arrival Threshold Rate</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{summary.lateRatePercentage}%</span>
          </div>
          <Progress value={summary.lateRatePercentage} className="h-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Weekly Attendance & Delay Trends</p>
          <AttendanceChart trendData={summary.trendData} />
        </div>
      </CardContent>
    </Card>
  );
}