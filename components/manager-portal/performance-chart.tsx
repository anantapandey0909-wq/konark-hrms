"use client";

import React from 'react';
import { PerformanceMetric } from '@/types/manager-portal';

interface PerformanceChartProps {
  readonly breakdown: readonly PerformanceMetric[];
}

export function PerformanceChart({ breakdown }: PerformanceChartProps) {
  return (
    <div className="space-y-4">
      {breakdown.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{item.score}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${item.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}