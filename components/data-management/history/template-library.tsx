'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TemplateCard from './template-card';
import { 
  Users, 
  Clock, 
  Calendar, 
  Coins, 
  Briefcase, 
  UserCheck, 
  Hourglass, 
  CalendarDays, 
  Network,
  FileSpreadsheet
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

interface TemplateSpec {
  id: string;
  title: string;
  desc: string;
  format: string;
  version: string;
  lastUpdated: string;
  icon: React.ComponentType<{ className?: string }>;
}

const templatesList: TemplateSpec[] = [
  { id: '1', title: 'Employee Import', desc: 'Core profiles required attributes schema.', format: 'XLSX', version: 'v1.4', lastUpdated: 'Jan 10, 2025', icon: Users },
  { id: '2', title: 'Attendance Import', desc: 'Biometric terminals clock timestamps model.', format: 'CSV', version: 'v2.1', lastUpdated: 'Jan 12, 2025', icon: Clock },
  { id: '3', title: 'Leave Import', desc: 'Absence balance updates ledger.', format: 'CSV', version: 'v1.0', lastUpdated: 'Jan 08, 2025', icon: Calendar },
  { id: '4', title: 'Payroll Import', desc: 'Salaries base formulas template schema.', format: 'XLSX', version: 'v1.2', lastUpdated: 'Jan 15, 2025', icon: Coins },
  { id: '5', title: 'Departments', desc: 'Structural lines corporate costs center codes.', format: 'CSV', version: 'v1.1', lastUpdated: 'Dec 20, 2024', icon: Briefcase },
  { id: '6', title: 'Designations', desc: 'Grade structures hierarchy levels titles.', format: 'XLSX', version: 'v1.0', lastUpdated: 'Nov 18, 2024', icon: UserCheck },
  { id: '7', title: 'Shifts & Rosters', desc: 'Hour parameters schedule frames models.', format: 'CSV', version: 'v1.5', lastUpdated: 'Jan 22, 2025', icon: Hourglass },
  { id: '8', title: 'Holiday Calendar', desc: 'Annual regional official day-off dates.', format: 'CSV', version: 'v1.1', lastUpdated: 'Dec 15, 2024', icon: CalendarDays },
  { id: '9', title: 'Organization Structure', desc: 'Geography branches codes and values.', format: 'XLSX', version: 'v1.0', lastUpdated: 'Oct 05, 2024', icon: Network }
];

export default function TemplateLibrary() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Template Schema Library
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Download standard structure models prior to batch writes configurations.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {templatesList.map((tpl) => (
            <motion.div key={tpl.id} variants={itemVariants}>
              <TemplateCard 
                title={tpl.title} 
                desc={tpl.desc} 
                format={tpl.format} 
                version={tpl.version} 
                lastUpdated={tpl.lastUpdated} 
                icon={tpl.icon} 
              />
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}