'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Timer, FileCode } from 'lucide-react';

const progressVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

export default function UploadProgress() {
  const mockState = {
    percentage: 75,
    stage: 'Writing cells onto structural entities...',
    estimatedTime: 'Estimated remaining time: ~12s',
    status: 'Importing'
  };

  return (
    <motion.div
      variants={progressVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Loader2 className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                  Executing Pipeline Write
                </span>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                  {mockState.stage}
                </p>
              </div>
            </div>
            <Badge className="text-[9px] font-extrabold uppercase tracking-wide bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-150 py-0.5 px-2">
              {mockState.status}
            </Badge>
          </div>

          {/* Graphical Progress Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-zinc-500 dark:text-zinc-400 font-mono">
              <span>Overall Progress</span>
              <span>{mockState.percentage}%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${mockState.percentage}%` }} 
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {mockState.estimatedTime}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <FileCode className="h-3.5 w-3.5" />
              Thread: Batch#91
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}