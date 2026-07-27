'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { UploadCloud, FileSpreadsheet, Info } from 'lucide-react';

const zoneVariants: Variants = {
  rest: { 
    scale: 1, 
    borderColor: 'rgba(228, 228, 231, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0)' 
  },
  hover: { 
    scale: 0.995, 
    borderColor: 'rgba(79, 70, 229, 0.4)',
    backgroundColor: 'rgba(79, 70, 229, 0.015)',
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

export default function UploadZone() {
  return (
    <motion.div
      variants={zoneVariants}
      initial="rest"
      whileHover="hover"
      className="cursor-default"
    >
      <Card className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {/* Large Animated Upload Icon */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full">
            <UploadCloud className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Bulk Data Import Workspace
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Drag your formatted spreadsheet file here, or click to explore local folders. Supporting standard extensions and dynamic platform validations.
            </p>
          </div>

          {/* Validation Metrics & Schema Rule Guides */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Supported: CSV, XLSX, XLS
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Maximum size: 10 MB
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}