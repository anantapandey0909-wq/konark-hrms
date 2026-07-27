'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Database, 
  TrendingUp, 
  AlertOctagon, 
  Clock, 
  CheckCircle, 
  Layers, 
  FileCheck,
  FolderSync
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DataModuleCard from './data-module-card';
import RecentImports from './recent-imports';
import QuickActions from './quick-actions';

// Strict Framer Motion Animation Variants Typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 95, damping: 15 } 
  },
};

// Interface structures for Statistics mapping
interface StatCardItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  colorClass: string;
}

const statsItems: StatCardItem[] = [
  {
    icon: Database,
    value: '384',
    label: 'Total Imports',
    trend: '+12% MoM',
    trendType: 'positive',
    colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
  },
  {
    icon: FileCheck,
    value: '192',
    label: 'Total Exports',
    trend: '+8.4% MoM',
    trendType: 'positive',
    colorClass: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
  },
  {
    icon: CheckCircle,
    value: '352',
    label: 'Successful Actions',
    trend: '91.6% Rate',
    trendType: 'positive',
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
  },
  {
    icon: AlertOctagon,
    value: '12',
    label: 'Failed Operations',
    trend: '3.1% Fail',
    trendType: 'negative',
    colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
  },
  {
    icon: Clock,
    value: '20',
    label: 'Pending Queue',
    trend: '5.2% Load',
    trendType: 'neutral',
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
  },
  {
    icon: Layers,
    value: '8 Active',
    label: 'Active Templates',
    trend: 'No changes',
    trendType: 'neutral',
    colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
  }
];

// Mock Data Module Configurations (8 Modules)
export interface DataModuleItem {
  id: string;
  name: string;
  description: string;
  formats: string[];
  lastImported: string;
  status: 'synced' | 'active' | 'maintenance';
  recordCount: number;
  historyCount: number;
}

const dataModules: DataModuleItem[] = [
  {
    id: 'employees',
    name: 'Employees',
    description: 'System profiles, personal settings, corporate role keys, and dynamic metadata registers.',
    formats: ['CSV', 'XLSX'],
    lastImported: '2 hours ago',
    status: 'synced',
    recordCount: 412,
    historyCount: 42
  },
  {
    id: 'departments',
    name: 'Departments',
    description: 'Corporate hierarchies, dynamic division cost centers, managers, and operational structures.',
    formats: ['CSV', 'XLSX'],
    lastImported: '3 days ago',
    status: 'synced',
    recordCount: 14,
    historyCount: 6
  },
  {
    id: 'attendance',
    name: 'Attendance',
    description: 'Biometric card terminal entries, working shift checkins, schedules, and overrides.',
    formats: ['CSV', 'XLSX'],
    lastImported: '1 day ago',
    status: 'active',
    recordCount: 28410,
    historyCount: 68
  },
  {
    id: 'leave',
    name: 'Leave',
    description: 'Staff allocation allowances, current leave balances, requested absences, and approvals.',
    formats: ['CSV', 'XLSX'],
    lastImported: '1 week ago',
    status: 'synced',
    recordCount: 1280,
    historyCount: 15
  },
  {
    id: 'payroll',
    name: 'Payroll',
    description: 'Base salaries, structural payroll models, extra commissions, and tax parameter logs.',
    formats: ['CSV', 'XLSX'],
    lastImported: '5 days ago',
    status: 'active',
    recordCount: 395,
    historyCount: 12
  },
  {
    id: 'holidays',
    name: 'Holidays',
    description: 'Recognized official national day-offs, enterprise holidays, and structural breaks.',
    formats: ['CSV'],
    lastImported: '1 month ago',
    status: 'synced',
    recordCount: 26,
    historyCount: 5
  },
  {
    id: 'shifts',
    name: 'Shifts',
    description: 'Organizational roster tables, core schedule rules, operational hourly limits.',
    formats: ['CSV', 'XLSX'],
    lastImported: '2 weeks ago',
    status: 'synced',
    recordCount: 82,
    historyCount: 8
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Central system details, branch locations, configuration parameters.',
    formats: ['CSV', 'XLSX'],
    lastImported: '6 months ago',
    status: 'maintenance',
    recordCount: 1,
    historyCount: 2
  }
];

export default function DataManagementDashboard() {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Statistics Cards Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border shrink-0 ${stat.colorClass}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge 
                      variant="secondary"
                      className={`text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-md ${
                        stat.trendType === 'positive' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40' 
                          : stat.trendType === 'negative'
                          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700/60'
                      }`}
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Available Data Modules */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FolderSync className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            System Directories
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataModules.map((module) => (
            <motion.div key={module.id} variants={itemVariants}>
              <DataModuleCard module={module} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Recent Import Activity & 4. Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <RecentImports />
        </motion.div>

        <motion.div className="space-y-6" variants={itemVariants}>
          <QuickActions />
        </motion.div>
      </div>
    </motion.div>
  );
}