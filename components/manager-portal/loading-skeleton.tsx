"use client";

import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="h-28 bg-slate-100 dark:bg-slate-900 rounded-2xl w-full border border-slate-200 dark:border-slate-800" />
      
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
        </div>
        <div className="space-y-6">
          <div className="h-[480px] bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          <div className="h-[280px] bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
        </div>
        <div className="space-y-6">
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
        </div>
      </div>
    </div>
  );
}