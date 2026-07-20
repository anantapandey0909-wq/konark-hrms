"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/notifications";
import type { Notification, NotificationAction } from "@/types/notification";

export interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onActionClick?: (
    notification: Notification,
    action: NotificationAction
  ) => void;
}

export function NotificationItem({
  notification,
  onClick,
  onActionClick,
}: NotificationItemProps) {
  const IconComponent = notification.icon || Bell;
const handleClick = () => {
  onClick?.(notification);
};

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(notification);
    }
  }, [notification, onClick]);

  const handleActionClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (notification.action) {
      onActionClick?.(notification, notification.action);
    }
  }, [notification, onActionClick]);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1, transition: { duration: 0.1 } }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
      className={`group relative flex gap-3 rounded-xl border p-4 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        notification.isRead
          ? "bg-white border-zinc-200/80 hover:border-zinc-300 dark:bg-zinc-950/20 dark:border-zinc-800/80 dark:hover:border-zinc-700"
          : "bg-blue-50/25 border-blue-100/70 hover:border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/30 dark:hover:border-blue-900/50"
      }`}
    >
      {/* Icon Area */}
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notification.color || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
        <IconComponent className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-4">
          <h4 className={`text-sm font-semibold truncate ${notification.isRead ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-950 dark:text-zinc-50"}`}>
            {notification.title}
          </h4>
          <span className="shrink-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed break-words">
          {notification.message}
        </p>

        {notification.action && (
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs font-medium border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              onClick={handleActionClick}
            >
              {notification.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="flex h-5 items-center pl-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100/70 dark:ring-blue-950" />
        </div>
      )}
    </motion.div>
  );
}