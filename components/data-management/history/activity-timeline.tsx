'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import type { HistoryJobItem } from './history-dashboard';

interface ActivityTimelineProps {
  jobs: HistoryJobItem[];
}

export default function ActivityTimeline({ jobs }: ActivityTimelineProps) {
  const events = jobs.slice(0, 8).map((job) => {
    const isExport = job.operation === 'Export';
    return {
      id: job.id,
      title:
        job.module +
        ' ' +
        (isExport ? 'export' : 'import') +
        ' completed',
      desc:
        job.importedRows > 0
          ? job.importedRows.toLocaleString() +
            ' row(s) · ' +
            job.requestedBy
          : job.requestedBy,
      time: job.completedAt,
      icon: isExport ? ArrowUpRight : ArrowDownLeft,
      colorClass: isExport
        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50'
        : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
    };
  });

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <Clock className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Audit Activity Timeline
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Recent import, export, and bulk operations from the audit log.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {events.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed py-2">
            No recent pipeline activity has been recorded yet.
          </p>
        ) : (
          events.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div key={evt.id} className="flex space-x-3.5 relative">
                {idx < events.length - 1 && (
                  <div className="absolute top-8 left-4 w-[2px] h-[calc(100%-1rem)] bg-zinc-100 dark:bg-zinc-800 -z-10" />
                )}

                <div
                  className={
                    'p-2 rounded-lg border h-8.5 w-8.5 shrink-0 flex items-center justify-center ' +
                    evt.colorClass
                  }
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      {evt.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                      {evt.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                    {evt.desc}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
