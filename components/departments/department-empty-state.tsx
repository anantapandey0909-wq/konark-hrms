"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DepartmentEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export function DepartmentEmptyState({
  title = "No Departments Found",
  description = "There are no departments available yet. Create a new department to get started.",
  actionLabel,
  onAction,
  icon: Icon = Building2,
  className,
}: DepartmentEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("w-full max-w-md mx-auto", className)}
    >
      <Card className="border border-muted/60 bg-card rounded-xl shadow-sm overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground/80 mb-5" aria-hidden="true">
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
            {description}
          </p>
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              size="sm"
              className="rounded-lg shadow-sm font-medium transition-transform duration-100 active:scale-95"
            >
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}