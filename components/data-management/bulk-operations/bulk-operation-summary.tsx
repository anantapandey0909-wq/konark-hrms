'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  SkipForward,
  Timer,
} from 'lucide-react';

interface BulkOperationSummaryProps {
  selectedCount?: number;
  validCount?: number;
  warningCount?: number;
  invalidCount?: number;
  skippedCount?: number;
}

export default function BulkOperationSummary({
  selectedCount = 0,
  validCount = 0,
  warningCount = 0,
  invalidCount = 0,
  skippedCount = 0,
}: BulkOperationSummaryProps) {
  const metrics = [
    {
      label: 'Selected',
      count: selectedCount,
      icon: FileSpreadsheet,
    },
    {
      label: 'Ready to Commit',
      count: validCount,
      icon: CheckCircle,
    },
    {
      label: 'Warnings',
      count: warningCount,
      icon: AlertTriangle,
    },
    {
      label: 'Errors',
      count: invalidCount,
      icon: AlertCircle,
    },
    {
      label: 'Skipped',
      count: skippedCount,
      icon: SkipForward,
    },
    {
      label: 'Est. Processing',
      countLabel: '--',
      icon: Timer,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card
              key={idx}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm h-full"
            >
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div className="p-1.5 rounded-lg border w-fit shrink-0 flex items-center justify-center h-8 w-8 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-150 dark:border-zinc-700/80">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                    {'countLabel' in metric && metric.countLabel
                      ? metric.countLabel
                      : metric.count}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                    {metric.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
