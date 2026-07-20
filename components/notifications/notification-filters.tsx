"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NOTIFICATION_FILTERS, type NotificationFilter } from "@/types/notification";

export interface NotificationFiltersProps {
  value: NotificationFilter;
  onValueChange: (value: NotificationFilter) => void;
  unreadCount?: number;
  disabled?: boolean;
  className?: string;
}

export function NotificationFilters({
  value,
  onValueChange,
  unreadCount,
  disabled = false,
  className,
}: NotificationFiltersProps) {
  return (
    <nav
      aria-label="Notification filters"
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto flex-nowrap md:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1",
        className
      )}
    >
      {NOTIFICATION_FILTERS.map((filter, index) => {
        const filterValue = filter;
        const filterLabel = filter.charAt(0) + filter.slice(1).toLowerCase();
        const isSelected = value === filterValue;

        return (
          <motion.div
            key={filterValue}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: index * 0.02 }}
            className="shrink-0"
          >
            <Button
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onValueChange(filterValue)}
              className={cn(
                "rounded-lg text-xs font-medium transition-all select-none",
                isSelected
                  ? "shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200"
              )}
            >
              <span>{filterLabel}</span>
              {filterValue === "UNREAD" && unreadCount !== undefined && unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 h-4 min-w-[16px] px-1 text-[9px] font-bold flex items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        );
      })}
    </nav>
  );
}