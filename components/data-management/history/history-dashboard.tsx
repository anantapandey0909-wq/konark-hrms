'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import ImportHistoryTable from './import-history-table';
import HistoryDetails from './history-details';
import ActivityTimeline from './activity-timeline';
import TemplateLibrary from './template-library';
import { 
  Database, 
  TrendingUp, 
  AlertOctagon, 
  Clock, 
  FileCheck, 
  Layers, 
  History 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Strict Framer Motion Animation Variants Typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  },
};

export interface HistoryJobItem {
  id: string;
  operation: 'Import' | 'Export';
  module: string;
  fileName: string;
  requestedBy: string;
  startedAt: string;
  completedAt: string;
  duration: string;
  status: 'Completed' | 'Running' | 'Queued' | 'Failed' | 'Cancelled';
  rowsProcessed: string;
  fileType: string;
  importedRows: number;
  failedRows: number;
  skippedRows: number;
  warnings: number;
}

const mockJobs: HistoryJobItem[] = [
  {
    id: 'JOB-2025-092',
    operation: 'Import',
    module: 'Attendance',
    fileName: 'Biometric_Logs_Feb_14.xlsx',
    requestedBy: 'Harshita Sharma',
    startedAt: 'Feb 15, 2025, 06:11 PM',
    completedAt: 'Feb 15, 2025, 06:12 PM',
    duration: '1m 12s',
    status: 'Completed',
    rowsProcessed: '1,420 rows',
    fileType: 'Excel (.xlsx)',
    importedRows: 1420,
    failedRows: 0,
    skippedRows: 0,
    warnings: 0
  },
  {
    id: 'JOB-2025-091',
    operation: 'Import',
    module: 'Employees',
    fileName: 'Onboarding_Batch_Q1.xlsx',
    requestedBy: 'Rohan Verma',
    startedAt: 'Feb 14, 2025, 08:29 AM',
    completedAt: 'Feb 14, 2025, 08:30 AM',
    duration: '45s',
    status: 'Failed',
    rowsProcessed: '48 rows',
    fileType: 'Excel (.xlsx)',
    importedRows: 44,
    failedRows: 4,
    skippedRows: 0,
    warnings: 2
  },
  {
    id: 'JOB-2025-090',
    operation: 'Export',
    module: 'Payroll',
    fileName: 'Payroll_Snapshot_Feb.csv',
    requestedBy: 'Priya Iyer',
    startedAt: 'Feb 13, 2025, 11:44 AM',
    completedAt: 'Feb 13, 2025, 11:45 AM',
    duration: '22s',
    status: 'Completed',
    rowsProcessed: '395 rows',
    fileType: 'CSV (.csv)',
    importedRows: 395,
    failedRows: 0,
    skippedRows: 0,
    warnings: 0
  },
  {
    id: 'JOB-2025-089',
    operation: 'Import',
    module: 'Leave',
    fileName: 'Carryover_Roster_Updates.csv',
    requestedBy: 'Amit Gupta',
    startedAt: 'Feb 08, 2025, 02:14 PM',
    completedAt: 'Feb 08, 2025, 02:15 PM',
    duration: '35s',
    status: 'Completed',
    rowsProcessed: '92 rows',
    fileType: 'CSV (.csv)',
    importedRows: 92,
    failedRows: 0,
    skippedRows: 0,
    warnings: 1
  }
];

export default function HistoryDashboard() {
  const [selectedJob, setSelectedJob] = useState<HistoryJobItem>(mockJobs[0]);

  const stats = [
    { label: 'Total Imports', value: '148', icon: Database, colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50' },
    { label: 'Total Exports', value: '96', icon: FileCheck, colorClass: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50' },
    { label: 'Successful Jobs', value: '232', icon: TrendingUp, colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50' },
    { label: 'Failed Jobs', value: '8', icon: AlertOctagon, colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50' },
    { label: 'Queued Jobs', value: '4', icon: Clock, colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50' },
    { label: 'Available Templates', value: '9 Active', icon: Layers, colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50' }
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page Title Header block */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <History className="h-4 w-4" />
            <span>Audit Trail & Schema Center</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            History & Template Library
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Examine transactional data pipeline summaries, dynamic error logs, activity timelines, and download compliant file schemas.
          </p>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div key={idx} variants={blockVariants}>
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm h-full">
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div className={`p-2 rounded-lg border w-fit shrink-0 ${item.colorClass}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                      {item.value}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Primary Workspace split: Table logs, detailed metadata, and audit timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.div className="lg:col-span-2 space-y-6" variants={blockVariants}>
          <ImportHistoryTable 
            jobs={mockJobs} 
            selectedJobId={selectedJob.id} 
            onSelectJob={setSelectedJob} 
          />
          <TemplateLibrary />
        </motion.div>

        <motion.div className="space-y-6" variants={blockVariants}>
          <HistoryDetails job={selectedJob} />
          <ActivityTimeline />
        </motion.div>
      </div>
    </motion.div>
  );
}