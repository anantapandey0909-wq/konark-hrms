'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAttendanceImport } from './attendance-import-context';

const summaryContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

export default function AttendanceImportSummary() {
  const {
    totalCount,
    validCount,
    invalidCount,
    importResult,
    blankRowsSkipped,
  } = useAttendanceImport();

  const summaryMetrics = [
    {
      label: 'Total Rows Found',
      count: totalCount,
      icon: FileSpreadsheet,
    },
    {
      label: 'Ready to Import',
      count: validCount,
      icon: CheckCircle,
    },
    {
      label: 'Blank Skipped',
      count: blankRowsSkipped,
      icon: AlertTriangle,
    },
    {
      label: 'Critical Errors',
      count: invalidCount,
      icon: AlertCircle,
    },
  ];

  return (
    <motion.div
      className="space-y-4"
      variants={summaryContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-2 gap-4">
        {summaryMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card
              key={idx}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm h-full"
            >
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
      {importResult && (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Last commit: {importResult.importedCount} imported,{" "}
          {importResult.failedCount} failed.
        </p>
      )}
    </motion.div>
  );
}
