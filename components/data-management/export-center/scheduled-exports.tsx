'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarRange, Info } from 'lucide-react';

/**
 * No scheduler / cron / worker exists in this repository.
 * Do not present fake scheduled jobs as if they execute.
 */
export default function ScheduledExports() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <CalendarRange className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Scheduled Data Pipelines
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Automated extractions schedules are not available in this release.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex gap-3 text-xs text-amber-900 dark:text-amber-200">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Coming soon</p>
            <p className="leading-relaxed text-[11px] opacity-90">
              This project has no background workers, cron jobs, or task queue.
              Use on-demand exports from the Generate action. Scheduling will
              require dedicated infrastructure before it can be enabled.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span>Scheduled jobs configured</span>
          <Badge
            variant="outline"
            className="text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800/80 border-none rounded py-0.5 px-1.5"
          >
            0 active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
