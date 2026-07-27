'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import BulkOperationCard from './bulk-operation-card';
import BulkActionSelector from './bulk-action-selector';
import BulkPreviewTable from './bulk-preview-table';
import BulkOperationSummary from './bulk-operation-summary';
import BulkJobHistory from './bulk-job-history';
import { Network, Info, ShieldAlert } from 'lucide-react';

const pageVariants: Variants = {
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

export default function BulkOperationsDashboard() {
  const [selectedAction, setSelectedAction] = useState<string>('transfer-dept');

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title block */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Network className="h-4 w-4" />
            <span>Core Enterprise Batch Actions Workspace</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bulk Operations Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Execute large-scale, organization-wide updates across employees, schedules, and payroll parameters safely. Prepare actions, review automatic boundary checks, and authorize batch commits.
          </p>
        </div>
      </div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left hand: Operations Cards & Action Selector */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={blockVariants} className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Target Operations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <BulkOperationCard />
            </div>
          </motion.div>

          <motion.div variants={blockVariants}>
            <BulkActionSelector 
              selectedActionId={selectedAction} 
              onSelectAction={setSelectedAction} 
            />
          </motion.div>

          <motion.div variants={blockVariants}>
            <BulkPreviewTable selectedActionId={selectedAction} />
          </motion.div>
        </div>

        {/* Right hand: Summary & Operational Rules */}
        <div className="space-y-6">
          <motion.div variants={blockVariants}>
            <BulkOperationSummary />
          </motion.div>

          <motion.div 
            variants={blockVariants}
            className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
          >
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Execution Boundary Guards</span>
              <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                Bulk transitions undergo strict cascade check algorithms. Modifying manager parameters automatically redirects operational reporting lines across child sub-units.
              </p>
            </div>
          </motion.div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col gap-4">
            <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-455 items-start">
              <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
              <p className="leading-normal text-[11px]">
                Valid transaction boundaries. Blocked elements marked with validation warning flags can be omitted from writing operations.
              </p>
            </div>
            
            <button
              disabled
              className="px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none text-center"
            >
              Trigger Batch Commit
            </button>
          </div>
        </div>
      </div>

      {/* Full Width: History Log */}
      <motion.div variants={blockVariants}>
        <BulkJobHistory />
      </motion.div>
    </motion.div>
  );
}