'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HistoryJobItem } from './history-dashboard';
import { 
  CheckCircle, 
  AlertCircle, 
  FileSpreadsheet, 
  Info, 
  ShieldCheck, 
  Activity,
  Layers,
  Clock
} from 'lucide-react';

interface HistoryDetailsProps {
  job: HistoryJobItem;
}

export default function HistoryDetails({ job }: HistoryDetailsProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <Activity className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Operations Diagnostics
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Selected execution parameters and file schema metadata.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4 text-xs font-medium text-zinc-500">
        {/* Job Title Metadata Block */}
        <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/40 space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-zinc-400">Job Reference:</span>
            <span className="font-bold font-mono text-zinc-900 dark:text-zinc-50">{job.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Source Module:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{job.module}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">File Type:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{job.fileType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Operation Period:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{job.duration}</span>
          </div>
        </div>

        {/* Diagnostic counters summary block */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-zinc-450" />
            <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-450">Diagnostic Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-800/85">
              <span className="text-[9px] uppercase font-bold text-zinc-400">Wrote Rows</span>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {job.importedRows}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-800/85">
              <span className="text-[9px] uppercase font-bold text-zinc-400">Warnings</span>
              <p className="text-base font-extrabold text-amber-500 dark:text-amber-400 font-mono mt-0.5">
                {job.warnings}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-800/85">
              <span className="text-[9px] uppercase font-bold text-zinc-400">Skipped Rows</span>
              <p className="text-base font-extrabold text-zinc-650 dark:text-zinc-350 font-mono mt-0.5">
                {job.skippedRows}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-800/85">
              <span className="text-[9px] uppercase font-bold text-zinc-400">Fail Errors</span>
              <p className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                {job.failedRows}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center space-x-2 text-[10px] text-zinc-400 leading-normal">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Completed execution: {job.completedAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}