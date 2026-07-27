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
  Settings, 
  Building, 
  HelpCircle,
  Database
} from 'lucide-react';

interface ModuleConfig {
  id: string;
  name: string;
  desc: string;
  records: string;
  lastExport: string;
  status: 'active' | 'synced' | 'maintenance';
  icon: React.ComponentType<{ className?: string }>;
}

const modules: ModuleConfig[] = [
  { id: 'emp', name: 'Employees', desc: 'Core profiles, job lines, metadata.', records: '412 rows', lastExport: 'Feb 15, 2025', status: 'synced', icon: Users },
  { id: 'dept', name: 'Departments', desc: 'Hierarchy bands, division costs.', records: '14 rows', lastExport: 'Feb 10, 2025', status: 'synced', icon: Briefcase },
  { id: 'att', name: 'Attendance', desc: 'Clock checks, biometric overrides.', records: '28,410 rows', lastExport: 'Feb 14, 2025', status: 'active', icon: Clock },
  { id: 'leave', name: 'Leave', desc: 'Absence metrics, balance registers.', records: '1,280 rows', lastExport: 'Feb 12, 2025', status: 'synced', icon: Calendar },
  { id: 'pay', name: 'Payroll', desc: 'Ledger components, tax bands.', records: '395 rows', lastExport: 'Feb 13, 2025', status: 'active', icon: Coins },
  { id: 'rep', name: 'Reports', desc: 'Generated logs, compliance files.', records: '84 records', lastExport: 'Jan 28, 2025', status: 'synced', icon: LineChart },
  { id: 'set', name: 'Settings', desc: 'Dynamic system configurations.', records: '120 keys', lastExport: 'Jan 15, 2025', status: 'synced', icon: Settings },
  { id: 'org', name: 'Organization', desc: 'Branch logs, entity values.', records: '1 record', lastExport: 'Dec 20, 2024', status: 'maintenance', icon: Building },
  { id: 'sup', name: 'Support', desc: 'User queries, dynamic issue logs.', records: '45 entries', lastExport: 'Never', status: 'synced', icon: HelpCircle }
];

const hoverVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -2, transition: { duration: 0.15, ease: 'easeOut' } }
};

export default function ExportModuleCard() {
  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    synced: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900',
    maintenance: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  };

  return (
    <>
      {modules.map((mod) => {
        const Icon = mod.icon || Database;
        return (
          <motion.div
            key={mod.id}
            variants={hoverVariants}
            initial="rest"
            whileHover="hover"
            className="cursor-default select-none"
          >
            <Card className="h-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm overflow-hidden">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant="outline" className={`capitalize border text-[9px] px-1.5 py-0.5 font-bold tracking-wide ${statusColors[mod.status]}`}>
                      {mod.status}
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      {mod.name}
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-455 leading-normal line-clamp-2">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Available records:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {mod.records}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span>Last snapshot:</span>
                    <span>{mod.lastExport}</span>
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