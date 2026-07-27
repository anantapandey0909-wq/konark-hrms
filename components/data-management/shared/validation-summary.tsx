'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, Slash, Info } from 'lucide-react';

const summaryVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

interface MetricSection {
  label: string;
  count: number;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  badgeClass: string;
}

const mockMetrics: MetricSection[] = [
  {
    label: 'Valid Rows',
    count: 1420,
    badgeText: 'Compliant',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40',
    badgeClass: 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
  },
  {
    label: 'Warnings Identified',
    count: 18,
    badgeText: 'Alerts',
    icon: AlertTriangle,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40',
    badgeClass: 'bg-amber-100/70 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
  },
  {
    label: 'Failed Errors',
    count: 0,
    badgeText: 'No Issues',
    icon: XCircle,
    colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40',
    badgeClass: 'bg-rose-100/70 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
  },
  {
    label: 'Skipped Rows',
    count: 2,
    badgeText: 'Duplicate',
    icon: Slash,
    colorClass: 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 border-zinc-150 dark:border-zinc-700/60',
    badgeClass: 'bg-zinc-150/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
  }
];

export default function ValidationSummary() {
  return (
    <motion.div
      variants={summaryVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <Info className="h-4.5 w-4.5 text-zinc-500" />
            <div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Validation Diagnostic Report
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Detailed metrics of index conflicts and validation rules status.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border ${metric.colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${metric.badgeClass}`}>
                      {metric.badgeText}
                    </Badge>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                      {metric.count.toLocaleString()}
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                      {metric.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}