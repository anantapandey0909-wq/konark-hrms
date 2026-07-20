"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NotificationTriggerProps {
  unreadCount?: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const NotificationTrigger = React.forwardRef<
  HTMLButtonElement,
  NotificationTriggerProps
>(
  (
    {
      unreadCount = 0,
      onClick,
      disabled = false,
      className,
    },
    ref
  ) => {
    const hasUnread = unreadCount > 0;
    const displayCount = unreadCount > 99 ? "99+" : unreadCount;

    const ariaLabel = hasUnread
      ? `Notifications, ${displayCount} unread`
      : "Notifications";

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn("relative shrink-0 rounded-xl", className)}
      >
        <Bell
          className="h-5 w-5 text-zinc-700 dark:text-zinc-300"
          aria-hidden="true"
        />

        <AnimatePresence>
          {hasUnread && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:bg-blue-500 dark:ring-zinc-950"
            >
              {displayCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    );
  }
);

NotificationTrigger.displayName = "NotificationTrigger";