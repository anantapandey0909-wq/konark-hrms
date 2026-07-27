'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  UserSquare2, 
  Network, 
  Hourglass, 
  CalendarDays,
  Database
} from 'lucide-react';

export type MasterDataType = 'departments' | 'designations' | 'organization' | 'shifts' | 'holidays';

export interface SelectorOption {
  id: MasterDataType;
  title: string;
  description: string;
  recordCount: number;
  status: 'synced' | 'active' | 'maintenance';
  icon: React.ComponentType<{ className?: string }>;
}

const selectorOptions: SelectorOption[] = [
  {
    id: 'departments',
    title: 'Departments',
    description: 'Corporate division structures, cost centers, and local operational units.',
    recordCount: 14,
    status: 'synced',
    icon: Building2
  },
  {
    id: 'designations',
    title: 'Designations',
    description: 'Corporate organizational job titles, hierarchical bands, and standard grade codes.',
    recordCount: 42,
    status: 'synced',
    icon: UserSquare2
  },
  {
    id: 'organization',
    title: 'Organization',
    description: 'Base enterprise parameter registries, corporate settings, and geographic branches.',
    recordCount: 1,
    status: 'maintenance',
    icon: Network
  },
  {
    id: 'shifts',
    title: 'Shifts & Rosters',
    description: 'Workstation hourly schedules, standard configurations, and grace duration metrics.',
    recordCount: 8,
    status: 'active',
    icon: Hourglass
  },
  {
    id: 'holidays',
    title: 'Holiday Calendar',
    description: 'Annual corporate closures, national festival breaks, and optional restricted days off.',
    recordCount: 26,
    status: 'synced',
    icon: CalendarDays
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardHoverVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -2, transition: { duration: 0.15, ease: 'easeOut' } }
};

interface MasterDataSelectorProps {
  selectedType: MasterDataType;
  onSelectType: (type: MasterDataType) => void;
}

export default function MasterDataSelector({ selectedType, onSelectType }: MasterDataSelectorProps) {
  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    synced: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900',
    maintenance: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center space-x-2">
        <Database className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Target System Registry
        </h3>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {selectorOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.id;
          return (
            <motion.div
              key={opt.id}
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              onClick={() => onSelectType(opt.id)}
              className="cursor-pointer"
            >
              <Card className={`h-full border p-4 flex flex-col justify-between space-y-4 shadow-sm transition-all ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/15 dark:ring-indigo-500/20 bg-indigo-50/5 dark:bg-zinc-900/80'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border ${
                      isSelected 
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-150 dark:border-indigo-900' 
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700'
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant="outline" className={`capitalize border text-[9px] px-1.5 py-0.5 font-bold tracking-wide ${statusColors[opt.status]}`}>
                      {opt.status}
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">
                      {opt.title}
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center text-[10.5px]">
                  <span className="font-medium text-zinc-400">Total records:</span>
                  <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
                    {opt.recordCount}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}