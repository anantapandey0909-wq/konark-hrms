'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Calendar, HardDrive, ShieldCheck } from 'lucide-react';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

export default function FileCard() {
  // Static presentation configurations matching typical ongoing file validation processes
  const mockFile = {
    name: 'Employees_Master_Q1_2025.xlsx',
    module: 'Employees',
    size: '1.45 MB',
    uploadedAt: 'Today, 02:40 PM',
    progress: 100,
    status: 'Verified'
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start space-x-3.5 overflow-hidden">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            
            <div className="overflow-hidden space-y-1">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[280px]" title={mockFile.name}>
                {mockFile.name}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold uppercase text-zinc-600 dark:text-zinc-300">
                  {mockFile.module}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  {mockFile.size}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {mockFile.uploadedAt}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <Badge 
              variant="outline" 
              className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 py-0.5 px-2 flex items-center gap-1"
            >
              <ShieldCheck className="h-3 w-3" />
              {mockFile.status}
            </Badge>
          </div>
        </div>

        {/* Mock progress tracker inside File Metadata card */}
        <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
            <span>Structure Check Completion</span>
            <span className="font-mono">{mockFile.progress}%</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
              style={{ width: `${mockFile.progress}%` }} 
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}