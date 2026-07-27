'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Plus } from 'lucide-react';

const emptyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

interface EmptyImportProps {
  heading?: string;
  description?: string;
  buttonLabel?: string;
}

export default function EmptyImport({
  heading = 'No Active Directories Selected',
  description = 'You are not running any bulk data synchronization operations at this time. Pick a directory module down below to execute fresh imports.',
  buttonLabel = 'Configure Data Mapping'
}: EmptyImportProps) {
  return (
    <motion.div
      variants={emptyVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
          {/* Static Illustration Wrapper */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-850 text-zinc-400 dark:text-zinc-500 border border-zinc-200/50 dark:border-zinc-800 rounded-full">
            <Database className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              {heading}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              {description}
            </p>
          </div>

          {buttonLabel && (
            <Button 
              size="sm" 
              variant="outline" 
              disabled 
              className="mt-2 text-xs border-zinc-200 dark:border-zinc-750 inline-flex items-center gap-1.5 h-8.5 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{buttonLabel}</span>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}