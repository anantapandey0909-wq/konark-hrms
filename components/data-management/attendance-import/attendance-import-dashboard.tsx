'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import AttendanceImportStepper from './attendance-import-stepper';
import AttendanceTemplateCard from './attendance-template-card';
import AttendanceFilePreview from './attendance-file-preview';
import AttendanceImportSummary from './attendance-import-summary';
import { Clock, Info, ShieldAlert } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export default function AttendanceImportDashboard() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Title / Description */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Clock className="h-4 w-4" />
            <span>Attendance Synchronization Workstation</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Attendance Ingestion Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Import raw terminal logs, biometric check-ins, and override shifts. Standardize columns to verify calculations, worked hours, and status parameters prior to core payroll integration.
          </p>
        </div>
      </div>

      {/* Workflow Stepper */}
      <motion.div variants={blockVariants}>
        <AttendanceImportStepper />
      </motion.div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side Panel */}
        <div className="space-y-6">
          <motion.div variants={blockVariants}>
            <AttendanceTemplateCard />
          </motion.div>

          <motion.div variants={blockVariants}>
            <AttendanceImportSummary />
          </motion.div>

          <motion.div 
            variants={blockVariants}
            className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
          >
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Overtime Calculation</span>
              <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                Worked hours are calculated dynamically based on local check-in and check-out stamps. Overtime hours are automatically compiled based on organizational guidelines.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side Table and Preview Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={blockVariants}>
            <AttendanceFilePreview />
          </motion.div>

          {/* Action Footer */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-450 items-start">
              <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
              <p className="leading-normal text-[11px]">
                Valid biometric parameters. Rows with warning markers can be bypassed during the synchronization write operation.
              </p>
            </div>
            
            <button
              disabled
              className="px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none shrink-0"
            >
              Commit Attendance Records
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}