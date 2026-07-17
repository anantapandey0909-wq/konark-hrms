"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface SettingsEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
}

export function SettingsEmptyState({
  title = "Nothing to Display",
  description = "There is no content available for this settings section yet.",
}: SettingsEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-muted"
        >
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">
            {title}
          </h3>

          <p className="max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}