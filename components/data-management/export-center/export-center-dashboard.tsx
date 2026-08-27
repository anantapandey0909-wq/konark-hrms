'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import ExportModuleCard from './export-module-card';
import ExportFormatSelector from './export-format-selector';
import ExportPreview from './export-preview';
import ExportHistory from './export-history';
import ScheduledExports from './scheduled-exports';
import {
  ExportCenterProvider,
  useExportCenter,
} from './export-center-context';
import { DownloadCloud, Info, ShieldAlert, Loader2 } from 'lucide-react';

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

function ExportCenterDashboardInner() {
  const { generate, isGenerating, isPreviewing, preview } = useExportCenter();
  const canGenerate =
    !!preview?.canExport && !isGenerating && !isPreviewing;

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
            <DownloadCloud className="h-4 w-4" />
            <span>Secure Ingestion & Extraction Services</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Export Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Generate tenant-scoped data extractions from core registers. Preview
            sample rows, then download a bounded CSV, JSON, or Excel-compatible
            file. Exports are limited to 10,000 rows per request.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={blockVariants} className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Available Databases
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ExportModuleCard />
            </div>
          </motion.div>

          <motion.div variants={blockVariants}>
            <ExportFormatSelector />
          </motion.div>

          <motion.div variants={blockVariants}>
            <ExportPreview />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={blockVariants}>
            <ScheduledExports />
          </motion.div>

          <motion.div
            variants={blockVariants}
            className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
          >
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Tenant-scoped downloads</span>
              <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                Files are generated in memory for your authenticated company
                only, then streamed to your browser. No permanent export storage
                or AES archive retention is configured in this release.
              </p>
            </div>
          </motion.div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col gap-4">
            <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-450 items-start">
              <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
              <p className="leading-normal text-[11px]">
                {preview?.message
                  ? preview.message
                  : preview?.canExport
                    ? `Ready to export ${preview.totalRows.toLocaleString()} record(s).`
                    : 'Select a module and format, then wait for preview before generating.'}
              </p>
            </div>

            <button
              type="button"
              disabled={!canGenerate}
              onClick={() => void generate()}
              className={
                canGenerate
                  ? 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm text-center inline-flex items-center justify-center gap-2'
                  : 'px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none text-center inline-flex items-center justify-center gap-2'
              }
            >
              {(isGenerating || isPreviewing) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {isGenerating
                ? 'Generating…'
                : isPreviewing
                  ? 'Preparing preview…'
                  : 'Generate Export'}
            </button>
          </div>
        </div>
      </div>

      <motion.div variants={blockVariants}>
        <ExportHistory />
      </motion.div>
    </motion.div>
  );
}

export default function ExportCenterDashboard() {
  return (
    <ExportCenterProvider>
      <ExportCenterDashboardInner />
    </ExportCenterProvider>
  );
}
