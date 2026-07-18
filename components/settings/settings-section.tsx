"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


export type { SettingsSubComponentProps } from "@/types/settings";

/**
 * @interface SettingsSectionProps
 * @description Standardized properties for the reusable Settings layout container.
 */
export interface SettingsSectionProps {
  readonly title: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

/**
 * @component SettingsSection
 * @description Layout wrapper implementing standard typography, spacing, and responsive 
 * architecture for all individual functional settings sections.
 */
export function SettingsSection({
  title,
  description,
  children,
  actions,
  className,
}: SettingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden border-muted/60 shadow-sm rounded-xl bg-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-muted/40 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">
              {actions}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}