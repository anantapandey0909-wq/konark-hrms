'use client';

import Link from "next/link";
import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataModuleItem } from './data-management-dashboard';
import {
  Users,
  Clock,
  Calendar,
  Coins,
  RefreshCw,
  Database,
  CloudLightning,
} from 'lucide-react';

interface DataModuleCardProps {
  module: DataModuleItem;
}

const MODULE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "employee-import": Users,
  "attendance-import": Clock,
  "leave-import": Calendar,
  "payroll-import": Coins,
  "master-data": Database,
  "export-center": Database,
  "history": RefreshCw,
  "bulk-operations": CloudLightning,
};

const hoverVariants: Variants = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export default function DataModuleCard({
  module,
}: DataModuleCardProps) {
  const IconComponent = MODULE_ICONS[module.id] || Database;

  const statusColors = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
    synced:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
    maintenance:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  };

  return (
    <motion.div
      variants={hoverVariants}
      initial="rest"
      whileHover="hover"
      className="h-full"
    >
      <Link href={module.href} className="block h-full">
        <Card className="h-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none transition-all hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/80 rounded-xl text-zinc-600 dark:text-zinc-300">
                  <IconComponent className="h-4.5 w-4.5" />
                </div>

                <Badge
                  variant="outline"
                  className={`capitalize border text-[10px] px-2 py-0.5 font-bold tracking-wide ${statusColors[module.status]}`}
                >
                  {module.status}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                  {module.name}
                </h3>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {module.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2 text-[10px]">
              <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
                <span className="font-medium">
                  Stored Records:
                </span>

                <span className="font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                  {module.recordCount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
                <span className="font-medium">
                  Total Actions:
                </span>

                <span className="font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                  {module.historyCount} imports
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-dotted border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500">
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Updated {module.lastImported}
                </span>

                <span className="font-mono text-[9px] bg-zinc-100 dark:bg-zinc-800/80 px-1 py-0.5 rounded font-bold">
                  {module.formats.join(", ")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}