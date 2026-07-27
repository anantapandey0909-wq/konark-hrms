'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Clock, 
  Calendar, 
  Coins, 
  Briefcase, 
  Download,
  Terminal,
  ArrowRight,
  Database
} from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const actionsList: ActionItem[] = [
  {
    id: 'emp',
    title: 'Employee Import',
    description: 'Bulk map employee records, system profiles, and initial metadata.',
    icon: Users
  },
  {
    id: 'att',
    title: 'Attendance Import',
    description: 'Sync daily clock times, biometric terminal records, and shift schedules.',
    icon: Clock
  },
  {
    id: 'leave',
    title: 'Leave Import',
    description: 'Update annual leave counters, active absences, and historic claims.',
    icon: Calendar
  },
  {
    id: 'pay',
    title: 'Payroll Import',
    description: 'Modify salary scales, performance bonuses, and allowances values.',
    icon: Coins
  },
  {
    id: 'dept',
    title: 'Department Import',
    description: 'Establish structural organizational trees and budget center mapping.',
    icon: Briefcase
  },
  {
    id: 'export',
    title: 'Export Center',
    description: 'Trigger secure platform backups and download history logs.',
    icon: Download
  }
];

const cardHoverVariants: Variants = {
  rest: { borderColor: 'rgba(228, 228, 231, 0.6)' },
  hover: { 
    borderColor: 'rgba(79, 70, 229, 0.4)',
    transition: { duration: 0.2 }
  }
};

const arrowMoveVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 3, transition: { type: 'spring', stiffness: 150 } }
};

export default function QuickActions() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Placeholder workspaces. Click action and navigation is disabled.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-3.5">
        {actionsList.map((act) => {
          const Icon = act.icon;
          return (
            <motion.div
              key={act.id}
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="flex items-start justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 cursor-default transition-colors"
            >
              <div className="flex items-start space-x-3 overflow-hidden">
                <div className="p-2 bg-white dark:bg-zinc-800 border border-zinc-250/50 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 mt-0.5 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="overflow-hidden space-y-0.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                    {act.description}
                  </p>
                </div>
              </div>

              <motion.div 
                className="text-zinc-400 dark:text-zinc-500 self-center shrink-0 pl-1"
                variants={arrowMoveVariants}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}