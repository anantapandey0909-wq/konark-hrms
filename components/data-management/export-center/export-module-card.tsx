'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Briefcase,
  Clock,
  Calendar,
  Coins,
  LineChart,
  Database,
} from 'lucide-react';
import { useExportCenter } from './export-center-context';
import type { ExportModule } from '@/lib/validation/export';

const iconMap: Record<
  ExportModule,
  React.ComponentType<{ className?: string }>
> = {
  employees: Users,
  departments: Briefcase,
  attendance: Clock,
  leave: Calendar,
  payroll: Coins,
  reports: LineChart,
};

const hoverVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -2, transition: { duration: 0.15, ease: 'easeOut' } },
};

function formatCount(n: number | null): string {
  if (n == null) return '—';
  return `${n.toLocaleString()} rows`;
}

function formatLast(iso: string | null): string {
  if (!iso) return 'Never';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ExportModuleCard() {
  const {
    modules,
    selectedModule,
    setSelectedModule,
    isLoadingModules,
  } = useExportCenter();

  if (isLoadingModules && modules.length === 0) {
    return (
      <div className="col-span-3 text-xs text-zinc-500 py-6">
        Loading available databases…
      </div>
    );
  }

  return (
    <>
      {modules.map((mod) => {
        const Icon = iconMap[mod.id] || Database;
        const selected = selectedModule === mod.id;
        const disabled = !mod.available;
        return (
          <motion.div
            key={mod.id}
            variants={hoverVariants}
            initial="rest"
            whileHover={disabled ? undefined : 'hover'}
            className={disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer select-none'}
            onClick={() => {
              if (!disabled) setSelectedModule(mod.id);
            }}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setSelectedModule(mod.id);
              }
            }}
          >
            <Card
              className={`h-full border shadow-sm overflow-hidden ${
                selected
                  ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`capitalize border text-[9px] px-1.5 py-0.5 font-bold tracking-wide ${
                        disabled
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : selected
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {disabled ? 'restricted' : selected ? 'selected' : 'ready'}
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      {mod.name}
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-455 leading-normal line-clamp-2">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Available records:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {formatCount(mod.recordCount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span>Last snapshot:</span>
                    <span>{formatLast(mod.lastExportAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </>
  );
}
