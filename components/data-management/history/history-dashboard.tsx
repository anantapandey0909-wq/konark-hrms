'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  History,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchImportHistory } from '@/lib/data/import-history';
import type { HistoryJobItem as ServiceHistoryJobItem } from '@/lib/services/import-history.service';
import { toast } from 'sonner';

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
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

/** Re-export UI shape used by table/details/timeline. */
export type HistoryJobItem = ServiceHistoryJobItem;

/** Static template library count — not transactional history. */
const AVAILABLE_TEMPLATES_LABEL = '9 Active';

const EMPTY_JOBS: HistoryJobItem[] = [];

type HistorySnapshot = {
  data: HistoryJobItem[] | null;
  error: string | null;
};

/**
 * Module-level cache so React Strict Mode double-mount does not double-fetch,
 * and so the effect only subscribes to an external async result (no sync setState).
 * Mutate fields only — keep the outer object const for prefer-const.
 */
const historyCache: {
  promise: Promise<HistoryJobItem[]> | null;
  snapshot: HistorySnapshot;
} = {
  promise: null,
  snapshot: { data: null, error: null },
};

const historyListeners = new Set<() => void>();

function notifyHistoryListeners() {
  historyListeners.forEach((l) => l());
}

function subscribeHistory(listener: () => void) {
  historyListeners.add(listener);
  return () => {
    historyListeners.delete(listener);
  };
}

/** Stable reference until the next successful/failed load. */
function getHistorySnapshot(): HistorySnapshot {
  return historyCache.snapshot;
}

function getServerHistorySnapshot(): HistorySnapshot {
  return { data: null, error: null };
}

function ensureHistoryLoad() {
  if (historyCache.promise) return;
  historyCache.promise = fetchImportHistory()
    .then((data) => {
      historyCache.snapshot = { data, error: null };
      notifyHistoryListeners();
      return data;
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load import history.';
      historyCache.snapshot = { data: EMPTY_JOBS, error: message };
      notifyHistoryListeners();
      return EMPTY_JOBS;
    });
}

export default function HistoryDashboard() {
  const snapshot = React.useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getServerHistorySnapshot
  );

  // Kick off the external fetch once (outside React setState-in-effect).
  useEffect(() => {
    ensureHistoryLoad();
  }, []);

  useEffect(() => {
    if (snapshot.error) {
      toast.error(snapshot.error);
    }
  }, [snapshot.error]);

  const jobs = snapshot.data ?? EMPTY_JOBS;
  const isLoading = snapshot.data === null;

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = useMemo(() => {
    if (jobs.length === 0) return null;
    if (selectedJobId) {
      return jobs.find((j) => j.id === selectedJobId) ?? jobs[0] ?? null;
    }
    return jobs[0] ?? null;
  }, [jobs, selectedJobId]);

  const stats = useMemo(() => {
    const totalImports = jobs.filter((j) => j.operation === 'Import').length;
    const totalExports = jobs.filter((j) => j.operation === 'Export').length;
    const successful = jobs.filter((j) => j.status === 'Completed').length;
    const failed = jobs.filter((j) => j.status === 'Failed').length;
    const queued = 0;

    return [
      {
        label: 'Total Imports',
        value: String(totalImports),
        icon: Database,
        colorClass:
          'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      },
      {
        label: 'Total Exports',
        value: String(totalExports),
        icon: FileCheck,
        colorClass:
          'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
      },
      {
        label: 'Successful Jobs',
        value: String(successful),
        icon: TrendingUp,
        colorClass:
          'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
      },
      {
        label: 'Failed Jobs',
        value: String(failed),
        icon: AlertOctagon,
        colorClass:
          'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
      },
      {
        label: 'Queued Jobs',
        value: String(queued),
        icon: Clock,
        colorClass:
          'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
      },
      {
        label: 'Available Templates',
        value: AVAILABLE_TEMPLATES_LABEL,
        icon: Layers,
        colorClass:
          'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
      },
    ];
  }, [jobs]);

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
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
            Examine tenant-scoped pipeline activity from the audit log, inspect
            job diagnostics, and download compliant file schemas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div key={idx} variants={blockVariants}>
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm h-full">
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div
                    className={
                      'p-2 rounded-lg border w-fit shrink-0 ' + item.colorClass
                    }
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                      {isLoading ? '—' : item.value}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.div className="lg:col-span-2 space-y-6" variants={blockVariants}>
          <ImportHistoryTable
            jobs={jobs}
            selectedJobId={selectedJob?.id ?? null}
            onSelectJob={(job) => setSelectedJobId(job.id)}
            isLoading={isLoading}
          />
          <TemplateLibrary />
        </motion.div>

        <motion.div className="space-y-6" variants={blockVariants}>
          <HistoryDetails job={selectedJob} />
          <ActivityTimeline jobs={jobs} />
        </motion.div>
      </div>
    </motion.div>
  );
}
