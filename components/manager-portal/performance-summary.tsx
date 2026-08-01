"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PerformanceSummary as PerformanceSummaryType } from '@/types/manager-portal';
import { PerformanceChart } from './performance-chart';
import { Award, Target, Zap } from 'lucide-react';

interface PerformanceSummaryProps {
  readonly summary: PerformanceSummaryType;
}

export function PerformanceSummary({ summary }: PerformanceSummaryProps) {
  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Award className="h-4 w-4 text-emerald-500" />
          <span>Department Performance Indices</span>
        </CardTitle>
        <CardDescription className="text-xs">Sprint achievements and objective completion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Goal Completion</span>
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary.goalCompletionRate}%</p>
            <Progress value={summary.goalCompletionRate} className="h-1 bg-slate-100 dark:bg-slate-800 mt-2.5" />
          </div>

          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Task Completion</span>
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {summary.taskCompletionCount} / {summary.targetTasks}
            </p>
            <span className="text-[10px] text-muted-foreground block mt-2 font-medium">Weekly allocated items completed</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Total Monthly Performance Rating</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{summary.monthlyPerformanceRate}%</span>
          </div>
          <Progress value={summary.monthlyPerformanceRate} className="h-1 bg-indigo-100 dark:bg-indigo-950/40" />
        </div>

        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Operations & Reliability Breakdown</p>
          <PerformanceChart breakdown={summary.breakdown} />
        </div>
      </CardContent>
    </Card>
  );
}