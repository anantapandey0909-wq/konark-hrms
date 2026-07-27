'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileSpreadsheet, 
  Download, 
  Users, 
  Clock, 
  Coins, 
  Briefcase, 
  Calendar 
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

interface TemplateOption {
  id: string;
  title: string;
  desc: string;
  format: string;
  icon: React.ComponentType<{ className?: string }>;
}

const templates: TemplateOption[] = [
  { id: 'emp', title: 'Employee Template', desc: 'Required fields for profile validation.', format: 'XLSX', icon: Users },
  { id: 'att', title: 'Attendance Template', desc: 'Raw clock logs biometric layout.', format: 'CSV', icon: Clock },
  { id: 'pay', title: 'Payroll Template', desc: 'Base salary structural formulas model.', format: 'XLSX', icon: Coins },
  { id: 'dept', title: 'Department Template', desc: 'Establish cost division mapping parameters.', format: 'CSV', icon: Briefcase },
  { id: 'leave', title: 'Leave Template', desc: 'Import carryover allowance parameters.', format: 'CSV', icon: Calendar },
];

export default function TemplateDownload() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Download Core Schema Templates
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Pre-structured sheets ready for error-free directory alignment.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <motion.div 
                key={tpl.id} 
                variants={itemVariants}
                className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono font-extrabold tracking-wide uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none px-1.5 py-0.5">
                      {tpl.format}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {tpl.title}
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-450 leading-relaxed line-clamp-2">
                      {tpl.desc}
                    </p>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled 
                  className="w-full text-xs h-8 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 border-zinc-200 dark:border-zinc-750 inline-flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-900"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}