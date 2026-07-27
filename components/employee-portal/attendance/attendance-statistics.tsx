"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface StatItem {
  label: string;
  hours: number;
}

interface AttendanceStatisticsProps {
  readonly stats: readonly StatItem[];
}

export function AttendanceStatistics({ stats }: AttendanceStatisticsProps) {
  // Baseline regular hours expected per week (9h * 5d = 45h target)
  const targetWeeklyHours = 45;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-slate-400" />
          Weekly Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {stats.map((item) => {
          const percentage = Math.min((item.hours / targetWeeklyHours) * 100, 100);
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="text-slate-500">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.hours}h</span> / {targetWeeklyHours}h
                </span>
              </div>
              <Progress value={percentage} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}