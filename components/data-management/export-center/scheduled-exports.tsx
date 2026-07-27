'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarRange, Hourglass, ShieldCheck } from 'lucide-react';

interface MockScheduledExport {
  id: string;
  title: string;
  schedule: string;
  targetModule: string;
  format: 'XLSX' | 'CSV' | 'PDF';
  nextRun: string;
  isActive: boolean;
}

const scheduledJobs: MockScheduledExport[] = [
  { id: 'SCH-001', title: 'Daily Attendance Sync', schedule: 'Daily at 11:30 PM', targetModule: 'Attendance', format: 'CSV', nextRun: 'Today, 11:30 PM', isActive: true },
  { id: 'SCH-002', title: 'Weekly Payroll Ledger', schedule: 'Every Friday at 06:00 PM', targetModule: 'Payroll', format: 'XLSX', nextRun: 'Feb 21, 2025, 06:00 PM', isActive: true },
  { id: 'SCH-003', title: 'Monthly Employee Audit', schedule: '1st of every month', targetModule: 'Employees', format: 'XLSX', nextRun: 'Mar 01, 2025, 12:00 AM', isActive: true },
  { id: 'SCH-004', title: 'Quarterly Reports Backup', schedule: 'First day of quarter', targetModule: 'Reports', format: 'PDF', nextRun: 'Apr 01, 2025, 12:00 AM', isActive: false }
];

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
              Automated database extractions written directly onto secure backup locations.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {scheduledJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/40 space-y-3.5"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                  {job.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  <span className="font-bold text-zinc-650 dark:text-zinc-350">{job.schedule}</span>
                  <span>•</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">module: {job.targetModule}</span>
                </div>
              </div>

              {/* Toggle switch visual only */}
              <div className="flex items-center space-x-2">
                <span className={`text-[9.5px] font-bold uppercase tracking-wider ${job.isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`}>
                  {job.isActive ? 'Active' : 'Paused'}
                </span>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 cursor-default ${job.isActive ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${job.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1 font-mono">
                <Hourglass className="h-3 w-3" />
                Next: {job.nextRun}
              </span>
              <Badge variant="outline" className="text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800/80 border-none rounded py-0.5 px-1.5">
                Format: {job.format}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}