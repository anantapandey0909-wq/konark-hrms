'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Download, Upload, Eye, CheckCircle } from 'lucide-react';

const stepperVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

interface StepItem {
  number: number;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'completed' | 'active' | 'upcoming';
}

export default function PayrollImportStepper() {
  const steps: StepItem[] = [
    {
      number: 1,
      label: 'Download Payroll Template',
      desc: 'Retrieve standard salary mapping sheet',
      icon: Download,
      status: 'completed',
    },
    {
      number: 2,
      label: 'Select Payroll File',
      desc: 'Load CSV/XLSX into safe RAM',
      icon: Upload,
      status: 'completed',
    },
    {
      number: 3,
      label: 'Review Payroll Records',
      desc: 'Perform calculations & diagnostics',
      icon: Eye,
      status: 'active',
    },
    {
      number: 4,
      label: 'Complete Import',
      desc: 'Sync updates with financial ledger',
      icon: CheckCircle,
      status: 'upcoming',
    },
  ];

  return (
    <motion.div
      variants={stepperVariants}
      className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex items-start space-x-3.5 relative">
              {/* Stepper Connector Lines (Hidden on Mobile) */}
              {idx < 3 && (
                <div className="hidden md:block absolute top-5 left-10 w-[calc(100%-2.5rem)] h-[2px] bg-zinc-100 dark:bg-zinc-800/80 -z-10">
                  <div 
                    className={`h-full ${step.status === 'completed' ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-transparent'}`} 
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {/* Step indicator Circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-all shrink-0 ${
                  step.status === 'completed'
                    ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                    : step.status === 'active'
                    ? 'bg-white text-indigo-600 border-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'bg-zinc-50 text-zinc-400 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-500 dark:border-zinc-800'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 dark:text-zinc-500 block">
                  Step 0{step.number}
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {step.label}
                </h4>
                <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 leading-tight">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}