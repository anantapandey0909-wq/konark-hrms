'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  Clock, 
  Calendar, 
  Coins, 
  Hourglass, 
  CalendarDays,
  Database
} from 'lucide-react';

interface OperationConfig {
  id: string;
  name: string;
  desc: string;
  estRecords: string;
  lastExec: string;
  status: 'Ready' | 'In Queue' | 'Under Review';
  icon: React.ComponentType<{ className?: string }>;
}

const operations: OperationConfig[] = [
  { id: 'emp_status', name: 'Status Update', desc: 'Bulk activate/deactivate personnel.', estRecords: '12 rows', lastExec: 'Feb 15, 2025', status: 'Ready', icon: Users },
  { id: 'dept_trans', name: 'Dept Transfer', desc: 'Shift staff across cost centers.', estRecords: '84 rows', lastExec: 'Feb 10, 2025', status: 'Ready', icon: Briefcase },
  { id: 'des_update', name: 'Designation Update', desc: 'Modify hierarchical grade codes.', estRecords: '32 rows', lastExec: 'Feb 14, 2025', status: 'Under Review', icon: UserCheck },
  { id: 'att_corr', name: 'Attendance Corr.', desc: 'Adjust clock swipes per batch.', estRecords: '1,420 entries', lastExec: 'Feb 12, 2025', status: 'Ready', icon: Clock },
  { id: 'leave_app', name: 'Leave Approval', desc: 'Mass authorize absence logs.', estRecords: '28 requests', lastExec: 'Feb 13, 2025', status: 'In Queue', icon: Calendar },
  { id: 'pay_gen', name: 'Payroll Gen.', desc: 'Process monthly salaries.', estRecords: '395 lines', lastExec: 'Jan 28, 2025', status: 'Ready', icon: Coins },
  { id: 'shift_asg', name: 'Shift Assignment', desc: 'Alter roster tables per department.', estRecords: '82 rosters', lastExec: 'Jan 15, 2025', status: 'Ready', icon: Hourglass },
  { id: 'hol_asg', name: 'Holiday Assignment', desc: 'Map closures onto calendar.', estRecords: '26 dates', lastExec: 'Dec 20, 2024', status: 'Ready', icon: CalendarDays }
];

const hoverVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -2, transition: { duration: 0.15, ease: 'easeOut' } }
};

export default function BulkOperationCard() {
  const statusColors = {
    'Ready': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    'In Queue': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  };

  return (
    <>
      {operations.map((op) => {
        const Icon = op.icon || Database;
        return (
          <motion.div
            key={op.id}
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
                    <Badge variant="outline" className={`capitalize border text-[9px] px-1.5 py-0.5 font-bold tracking-wide ${statusColors[op.status]}`}>
                      {op.status}
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      {op.name}
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-455 leading-normal line-clamp-2">
                      {op.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Target Rows:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {op.estRecords}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span>Last run:</span>
                    <span>{op.lastExec}</span>
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