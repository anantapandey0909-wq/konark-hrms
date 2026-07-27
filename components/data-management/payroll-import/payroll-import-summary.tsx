'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const summaryVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

interface SummaryMetric {
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

const mockMetrics: SummaryMetric[] = [
  {
    label: 'Total Records',
    count: 5,
    icon: FileSpreadsheet,
    colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50'
  },
  {
    label: 'Ready to Import',
    count: 3,
    icon: CheckCircle,
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50'
  },
  {
    label: 'System Warnings',
    count: 0,
    icon: AlertTriangle,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50'
  },
  {
    label: 'Critical Failures',
    count: 2,
    icon: AlertCircle,
    colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50'
  }
];

export default function PayrollImportSummary() {
  return (
    <motion.div 
      className="space-y-4"
      variants={summaryVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-2 gap-4">
        {mockMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm h-full">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div className="p-1.5 rounded-lg border w-fit shrink-0 overflow-hidden text-center justify-center flex items-center align-middle h-8.5 w-8.5 leading-none bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-150 dark:border-zinc-700/80">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                    {metric.count}
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
    </motion.div>
  );
}