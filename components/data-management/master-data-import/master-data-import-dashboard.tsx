'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import MasterDataSelector, { MasterDataType } from './master-data-selector';
import MasterDataImportStepper from './master-data-import-stepper';
import MasterDataTemplateCard from './master-data-template-card';
import MasterDataFilePreview from './master-data-file-preview';
import MasterDataImportSummary from './master-data-import-summary';
import { Settings, Info, ShieldAlert } from 'lucide-react';

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

export default function MasterDataImportDashboard() {
  const [selectedType, setSelectedType] = useState<MasterDataType>('departments');

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
            <Settings className="h-4 w-4" />
            <span>Core Enterprise Registers Workspace</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Master Data Import Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Synchronize foundational structural registries across departments, shift limits, branches, design grades, and closures. Pre-validate layout matrices prior to active record changes.
          </p>
        </div>
      </div>

      {/* Selector and Stepper Panels */}
      <motion.div variants={blockVariants}>
        <MasterDataSelector selectedType={selectedType} onSelectType={setSelectedType} />
      </motion.div>

      <motion.div variants={blockVariants}>
        <MasterDataImportStepper />
      </motion.div>

      {/* Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Hand: Controls & Ingestion Metadata */}
        <div className="space-y-6">
          <motion.div variants={blockVariants}>
            <MasterDataTemplateCard selectedType={selectedType} />
          </motion.div>

          <motion.div variants={blockVariants}>
            <MasterDataImportSummary />
          </motion.div>

          <motion.div 
            variants={blockVariants}
            className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
          >
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Registry Consistency</span>
              <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                Foundational registers dictate security pathways and UI fields. Changing parent elements directly may cascade modifications across employee profiles.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Hand: Structured File Preview Data */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={blockVariants}>
            <MasterDataFilePreview selectedType={selectedType} />
          </motion.div>

          {/* Action Footer */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-450 items-start">
              <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
              <p className="leading-normal text-[11px]">
                Valid layout parameters detected. Rows containing error flags can be ignored or bypassed during structural synchronization writes.
              </p>
            </div>
            
            <button
              disabled
              className="px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none shrink-0"
            >
              Commit Master Registry
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}