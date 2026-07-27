'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileDown, 
  ShieldAlert, 
  XCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface TimelineEvent {
  title: string;
  desc: string;
  time: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

const timelineEvents: TimelineEvent[] = [
  { title: 'Attendance logs synchronized', desc: 'Sync compiled 1,420 biometric records successfully.', time: '10m ago', status: 'Success', icon: ArrowDownLeft, colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50' },
  { title: 'Payroll export initialized', desc: 'Financial snapshot requested for ledger analysis.', time: '1h ago', status: 'In Queue', icon: ArrowUpRight, colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50' },
  { title: 'Departments schema downloaded', desc: 'Organizational model XLSX file requested.', time: '4h ago', status: 'Bypassed', icon: FileDown, colorClass: 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 border-zinc-150 dark:border-zinc-700/60' },
  { title: 'Personnel imports failed', desc: 'Strict validation parameters blocked write limits.', time: 'Yesterday', status: 'Aborted', icon: XCircle, colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50' }
];

export default function ActivityTimeline() {
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
              Chronological log of dynamic platform operations events.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {timelineEvents.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div key={idx} className="flex space-x-3.5 relative">
              {idx < timelineEvents.length - 1 && (
                <div className="absolute top-8 left-4 w-[2px] h-[calc(100%-1rem)] bg-zinc-100 dark:bg-zinc-800 -z-10" />
              )}
              
              <div className={`p-2 rounded-lg border h-8.5 w-8.5 shrink-0 flex items-center justify-center ${evt.colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                    {evt.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">{evt.time}</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                  {evt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}