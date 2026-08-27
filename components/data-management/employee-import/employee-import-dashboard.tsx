'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Loader2, Users, Info, ShieldAlert } from 'lucide-react';
import EmployeeImportStepper from './employee-import-stepper';
import EmployeeTemplateCard from './employee-template-card';
import EmployeeFilePreview from './employee-file-preview';
import EmployeeImportSummary from './employee-import-summary';
import {
  EmployeeImportProvider,
  useEmployeeImport,
} from './employee-import-context';

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

function EmployeeImportDashboardInner() {
  const {
    canExecute,
    isImporting,
    isValidating,
    executeImport,
    importResult,
    validCount,
    invalidCount,
  } = useEmployeeImport();

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Users className="h-4 w-4" />
            <span>Personnel Ingestion Pipeline</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Employee Directory Import Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Standardized bulk-loading directory workflow. Download formal sheets,
            verify column maps, and evaluate real-time file previews before
            committing records to database layers.
          </p>
        </div>
      </div>

      <motion.div variants={sectionVariants}>
        <EmployeeImportStepper />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-6">
          <motion.div variants={sectionVariants}>
            <EmployeeTemplateCard />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <EmployeeImportSummary />
          </motion.div>

          <motion.div
            variants={sectionVariants}
            className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
          >
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Automated Key Linkages</span>
              <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                Department name or code is matched within your organization.
                Duplicate employee IDs or emails (in-file or existing) block the
                entire import until resolved.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={sectionVariants}>
            <EmployeeFilePreview />
          </motion.div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-450 items-start">
              <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
              <div className="leading-normal text-[11px] space-y-1">
                <p>
                  {isValidating
                    ? 'Validating rows against your organization…'
                    : invalidCount > 0
                      ? 'Fix all invalid rows (or re-upload) before committing. Partial import is disabled.'
                      : 'All validations must pass before execution. The commit is transactional.'}
                </p>
                {importResult && (
                  <p className="font-semibold text-zinc-700 dark:text-zinc-200">
                    Last run: {importResult.importedCount} imported,{' '}
                    {importResult.failedCount} failed (of{' '}
                    {importResult.totalRows}).
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={!canExecute}
              onClick={() => void executeImport()}
              className={
                canExecute
                  ? 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shrink-0 inline-flex items-center gap-2'
                  : 'px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none shrink-0 inline-flex items-center gap-2'
              }
            >
              {(isImporting || isValidating) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {isImporting
                ? 'Committing…'
                : isValidating
                  ? 'Validating…'
                  : validCount > 0 && invalidCount === 0
                    ? 'Execute Database Commits (' + validCount + ')'
                    : 'Execute Database Commits'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EmployeeImportDashboard() {
  return (
    <EmployeeImportProvider>
      <EmployeeImportDashboardInner />
    </EmployeeImportProvider>
  );
}
