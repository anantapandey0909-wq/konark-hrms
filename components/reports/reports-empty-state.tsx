"use client";

import { motion, type Variants } from "framer-motion";
import { BarChart3, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ReportsEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

const animationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 16,
    },
  },
};

export function ReportsEmptyState({
  title = "No reports available",
  description = "There are currently no reports available for the selected filters. Try adjusting the filter criteria or generate a new report.",
  actionLabel,
  onAction,
  icon: Icon = BarChart3,
}: ReportsEmptyStateProps) {
  const showActionButton = !!(actionLabel && onAction);

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <motion.div
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="border border-border/40 bg-card shadow-xs">
          <CardContent className="flex flex-col items-center text-center p-8">
            {/* Visual Icon Container */}
            <div className="p-4 rounded-full bg-muted/60 text-muted-foreground/80 mb-6 border border-border/40">
              <Icon className="h-10 w-10 stroke-[1.5]" />
            </div>

            {/* Typography Section */}
            <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {description}
            </p>

            {/* Conditional Operational Action Button */}
            {showActionButton && (
              <Button
                variant="outline"
                onClick={onAction}
                className="w-full sm:w-auto"
              >
                {actionLabel}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}