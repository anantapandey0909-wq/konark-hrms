"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Compass } from "lucide-react";

interface TimelineLog {
  id: string;
  activity: string;
  time: string;
  date: string;
  location: string;
}

interface AttendanceTimelineProps {
  readonly logs: readonly TimelineLog[];
}

export function AttendanceTimeline({ logs }: AttendanceTimelineProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          Punch Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800 space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="relative">
              {/* Timeline dot */}
              <span className="absolute -left-[29px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-950">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
              </span>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {log.activity}
                  </h4>
                  <span className="font-mono text-slate-500 font-semibold">{log.time}</span>
                </div>
                <p className="text-[11px] text-slate-400">{log.date}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  <Compass className="h-3 w-3" />
                  {log.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}