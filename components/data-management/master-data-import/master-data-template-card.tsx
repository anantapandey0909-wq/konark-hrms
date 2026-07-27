'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, Download, Columns, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MasterDataType } from './master-data-selector';

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

interface TemplateConfig {
  title: string;
  requiredColumns: number;
  maxRecommendedRows: string;
}

const TEMPLATE_SPECS: Record<MasterDataType, TemplateConfig> = {
  departments: {
    title: 'Department Registry Template',
    requiredColumns: 5,
    maxRecommendedRows: '100 max departments'
  },
  designations: {
    title: 'Designations Band Template',
    requiredColumns: 6,
    maxRecommendedRows: '500 max role titles'
  },
  organization: {
    title: 'Organization Config Template',
    requiredColumns: 8,
    maxRecommendedRows: '10 max core branches'
  },
  shifts: {
    title: 'Shifts & Rosters Template',
    requiredColumns: 6,
    maxRecommendedRows: '50 max operational shifts'
  },
  holidays: {
    title: 'Holiday Event Template',
    requiredColumns: 4,
    maxRecommendedRows: '150 max annual breaks'
  }
};

interface MasterDataTemplateCardProps {
  selectedType: MasterDataType;
}

export default function MasterDataTemplateCard({ selectedType }: MasterDataTemplateCardProps) {
  const spec = TEMPLATE_SPECS[selectedType] || TEMPLATE_SPECS.departments;

  return (
    <motion.div
      variants={cardVariants}
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
        <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                Structure Schema Guidelines
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              {spec.title}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
              Validate corporate coordinates columns prior to structural modification.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 py-3 border-y border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-450 font-medium">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Columns className="h-4 w-4 text-zinc-450" />
                Required Columns:
              </span>
              <span className="font-bold text-zinc-950 dark:text-zinc-100 font-mono">
                {spec.requiredColumns} Fields
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-zinc-450" />
                System Recommendation:
              </span>
              <span className="text-zinc-650 dark:text-zinc-400">
                {spec.maxRecommendedRows}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full h-9 rounded-lg border border-zinc-250 dark:border-zinc-750 text-xs font-bold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-not-allowed inline-flex items-center justify-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-850"
          >
            <Download className="h-4 w-4 shrink-0" />
            Download Specific Template
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}