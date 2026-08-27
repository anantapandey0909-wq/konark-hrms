'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Settings, Info, ShieldAlert, Loader2 } from 'lucide-react';
import MasterDataSelector, { MasterDataType } from './master-data-selector';
import MasterDataImportStepper from './master-data-import-stepper';
import MasterDataTemplateCard from './master-data-template-card';
import MasterDataFilePreview from './master-data-file-preview';
import MasterDataImportSummary from './master-data-import-summary';
import {
  DepartmentImportProvider,
  useDepartmentImport,
} from './department-import-context';

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

function MasterDataImportDashboardInner({
  selectedType,
  setSelectedType,
}: {
  selectedType: MasterDataType;
  setSelectedType: (t: MasterDataType) => void;
}) {
  const {
    canExecute,
    isImporting,
    isValidating,
    executeImport,
    importResult,
    validCount,
    invalidCount,
  } = useDepartmentImport();

  const isDepartments = selectedType === 'departments';
  const commitEnabled = isDepartments && canExecute;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
            Synchronize foundational structural registries across departments,
            shift limits, branches, design grades, and closures. Pre-validate
            layout matrices prior to active record changes.
          </p>
        </div>
      </div>

      <motion.div variants={blockVariants}>
        <MasterDataSelector
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />
      </motion.div>

      <motion.div variants={blockVariants}>
        <MasterDataImportStepper />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-6">
          <motion.div variants={blockVariants}>
            <MasterDataTemplateCard selectedType={selectedType} />
          </motion.div>

          <motion.div variants={blockVariants}>
            <MasterDataImportSummary selectedType={selectedType} />
          </motion.div>

          <motion.div
            variants={blockVariants}
            className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
          >
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Registry Consistency</span>
              <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                {isDepartments
                  ? 'Department import is create-only and all-or-nothing. Duplicate or existing department codes block the entire commit. Other master-data types are not wired in this phase.'
                  : 'Foundational registers dictate security pathways and UI fields. Department CSV import is available when Departments is selected.'}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={blockVariants}>
            <MasterDataFilePreview selectedType={selectedType} />
          </motion.div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-450 items-start">
              <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
              <div className="leading-normal text-[11px] space-y-1">
                <p>
                  {!isDepartments
                    ? 'Select Departments to import CSV master data. Other registry types are not available yet.'
                    : isValidating
                      ? 'Validating department codes against the registry…'
                      : invalidCount > 0
                        ? 'Fix all invalid rows (or re-upload) before committing. Partial import is disabled.'
                        : 'All validations must pass before execution. The commit is transactional.'}
                </p>
                {isDepartments && importResult && (
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
              disabled={!commitEnabled}
              onClick={() => {
                if (isDepartments) void executeImport();
              }}
              className={
                commitEnabled
                  ? 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shrink-0 inline-flex items-center gap-2'
                  : 'px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none shrink-0 inline-flex items-center gap-2'
              }
            >
              {isDepartments && (isImporting || isValidating) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {isDepartments && isImporting
                ? 'Committing…'
                : isDepartments && isValidating
                  ? 'Validating…'
                  : isDepartments && validCount > 0 && invalidCount === 0
                    ? 'Commit Master Registry (' + validCount + ')'
                    : 'Commit Master Registry'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MasterDataImportDashboard() {
  const [selectedType, setSelectedType] =
    useState<MasterDataType>('departments');

  return (
    <DepartmentImportProvider>
      <MasterDataImportDashboardInner
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </DepartmentImportProvider>
  );
}
