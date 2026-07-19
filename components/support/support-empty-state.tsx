import * as React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SupportEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function SupportEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = HelpCircle,
  className,
}: SupportEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-8 ring-muted/20 dark:ring-muted/10">
        <Icon className="h-7 w-7 text-muted-foreground/80" />
      </div>

      <h3 className="mt-5 text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          size="sm"
          className="mt-6 font-medium shadow-sm active:scale-95 transition-transform"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}