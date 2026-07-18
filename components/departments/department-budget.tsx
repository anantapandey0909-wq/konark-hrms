"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Wallet, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { DepartmentBudget as IDepartmentBudget } from "@/types/department";

interface DepartmentBudgetProps {
  budget: IDepartmentBudget;
  className?: string;
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export function DepartmentBudget({ budget, className }: DepartmentBudgetProps) {
  const { allocated, utilized, remaining } = budget;

  const utilizationPercentage = allocated > 0 
    ? Math.round((utilized / allocated) * 1000) / 10 
    : 0;

  const progressValue = Math.min(100, Math.max(0, utilizationPercentage));

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className={cn(
        "overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}>
        <CardHeader className="border-b border-muted/40 pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-4.5 w-4.5 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base font-semibold text-foreground tracking-tight select-none">
              Financial Budget Allocation
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground select-none">
                Allocated Budget
              </span>
              <div className="text-lg font-bold text-foreground tracking-tight select-all">
                {inrFormatter.format(allocated)}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground select-none">
                Utilized Budget
              </span>
              <div className="text-lg font-bold text-foreground tracking-tight select-all">
                {inrFormatter.format(utilized)}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground select-none">
                Remaining Budget
              </span>
              <div className={cn(
                "text-lg font-bold tracking-tight select-all",
                remaining < 0 ? "text-destructive" : "text-foreground"
              )}>
                {inrFormatter.format(remaining)}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-muted/30">
            <div className="flex items-center justify-between text-xs font-medium select-none">
              <span className="text-muted-foreground">
                Budget Utilization
              </span>
              <span className={cn(
                "font-semibold",
                utilizationPercentage > 100 ? "text-destructive" : "text-foreground"
              )}>
                {utilizationPercentage}%
              </span>
            </div>
            <Progress 
              value={progressValue} 
              className="h-2 rounded-full" 
              aria-label="Department budget utilization progress"
            />
            {utilizationPercentage > 90 && (
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 mt-1 select-none" aria-live="polite">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Warning: Budget utilization threshold exceeded.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}