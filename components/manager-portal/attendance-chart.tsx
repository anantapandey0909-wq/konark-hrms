"use client";

import React from 'react';
import { AttendanceTrend } from '@/types/manager-portal';

interface AttendanceChartProps {
  readonly trendData: readonly AttendanceTrend[];
}

export function AttendanceChart({ trendData }: AttendanceChartProps) {
  const maxVal = 100;

  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-end h-32 gap-3.5 px-2">
        {trendData.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group">
            <div className="w-full flex justify-center gap-1.5 items-end h-24">
              {/* Present Rate Bar */}
              <div 
                className="w-3 bg-indigo-600 rounded-t-sm hover:bg-indigo-700 transition-all duration-300 relative"
                style={{ height: `${(d.presentRate / maxVal) * 100}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-md">
                  P: {d.presentRate}%
                </div>
              </div>
              {/* Late Rate Bar */}
              <div 
                className="w-3 bg-amber-500 rounded-t-sm hover:bg-amber-600 transition-all duration-300 relative"
                style={{ height: `${(d.lateRate / maxVal) * 100}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-md">
                  L: {d.lateRate}%
                </div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground mt-2">{d.date}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-4 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm" />
          <span className="text-muted-foreground">Present %</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
          <span className="text-muted-foreground">Late Arrival %</span>
        </div>
      </div>
    </div>
  );
}