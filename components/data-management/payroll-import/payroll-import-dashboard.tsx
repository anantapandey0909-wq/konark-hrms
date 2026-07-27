'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import PayrollImportStepper from './payroll-import-stepper';
import PayrollTemplateCard from './payroll-template-card';
import PayrollFilePreview from './payroll-file-preview';
import PayrollImportSummary from './payroll-import-summary';
import { Coins, Info, ShieldAlert } from 'lucide-react';

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

export default function PayrollImportDashboard() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title block */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Coins className="h-4 w-4" />
            <span>Salary Ledger Synchronization Workspace</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Payroll Import Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Synchronize monthly corporate base salaries, structural parameters, bonus updates, and deductions. Run column-wise calculations and validation overrides to ensure ledger consistency.
          </p>
        </div>
      </div>

      {/* Stepper block */}
      <motion.div variants={blockVariants}>
        <PayrollImportStepper />
      </motion.div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Hand: Controls & Ingestion Metadata */}
        <div className="space-y-6">
          <motion.div variants={blockVariants}>
            <PayrollTemplateCard />
          </motion.div>

          <motion.div variants={blockVariants}>
            <PayrollImportSummary />
          </motion.div>

          <motion.div 
            variants={blockVariants}
            className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
          >
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Statutory Deductions Check</span>
              <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                Incoming basic salaries are cross-referenced with pre-configured tax ranges. Rows containing unbalanced values will display structured error diagnostic markers.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Hand: Structured File Preview Data */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={blockVariants}>
            <PayrollFilePreview />
          </motion.div>

          {/* Action Footer */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-450 items-start">
              <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
              <p className="leading-normal text-[11px]">
                Biometric compliance parameters evaluated. Rows displaying warning elements can be bypassed during the synchronization write operation.
              </p>
            </div>
            
            <button
              disabled
              className="px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none shrink-0"
            >
              Commit Payroll Records
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}