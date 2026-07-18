"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DepartmentSummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export function DepartmentSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: DepartmentSummaryCardProps) {
  const isNegative = trend?.trim().startsWith("-");
  const trendColor = isNegative
    ? "text-destructive"
    : "text-emerald-600 dark:text-emerald-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full"
    >
      <Card className={cn(
        "overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-muted-foreground/20",
        className
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight select-none">
            {title}
          </CardTitle>
          <Icon className="h-4.5 w-4.5 text-muted-foreground/70" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground tracking-tight select-all">
            {value}
          </div>
          {(description || trend) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground select-none">
              {trend && (
                <span className={cn("font-medium", trendColor)}>
                  {trend}
                </span>
              )}
              {description && (
                <span className="truncate">
                  {description}
                </span>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}