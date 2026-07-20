"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { filterNotifications, unreadCount } from "@/lib/notifications";
import { NotificationFilters } from "./notification-filters";
import { NotificationList } from "./notification-list";
import type { Notification, NotificationAction, NotificationFilter } from "@/types/notification";

export interface NotificationPanelProps {
  notifications: Notification[];
  loading?: boolean;
  onNotificationClick?: (notification: Notification) => void;
  onActionClick?: (
    notification: Notification,
    action: NotificationAction
  ) => void;
  onMarkAllAsRead?: () => void;
  className?: string;
}

export function NotificationPanel({
  notifications,
  loading = false,
  onNotificationClick,
  onActionClick,
  onMarkAllAsRead,
  className,
}: NotificationPanelProps) {
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>("ALL");

  const computedUnreadCount = useMemo(() => {
    return unreadCount(notifications);
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return filterNotifications(notifications, selectedFilter);
  }, [notifications, selectedFilter]);

  const emptyTitle = selectedFilter === "ALL"
    ? "No notifications"
    : `No ${selectedFilter.toLowerCase()} notifications`;

  const emptyDescription = selectedFilter === "ALL"
    ? "You're all caught up. New notifications will appear here."
    : "No notifications match the selected filter.";

  return (
    <motion.section
      aria-labelledby="notification-panel-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex flex-col h-[520px] max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl dark:border-zinc-800/60 dark:bg-zinc-950",
        className
      )}
    >
      {/* Panel Header */}
      <header className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <h2 id="notification-panel-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Notifications
          </h2>
          {computedUnreadCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold rounded-full">
              {computedUnreadCount} unread
            </Badge>
          )}
        </div>
        {computedUnreadCount > 0 && onMarkAllAsRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="h-8 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200"
          >
            Mark all as read
          </Button>
        )}
      </header>

      {/* Filter Bar Container */}
      <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-800/40">
        <NotificationFilters
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          unreadCount={computedUnreadCount}
          disabled={loading}
        />
      </div>

      {/* Scrollable Notification List Wrapper */}
      <div className="flex-1 overflow-hidden">
        <NotificationList
          notifications={filteredNotifications}
          loading={loading}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          onNotificationClick={onNotificationClick}
          onActionClick={onActionClick}
          className="h-full"
        />
      </div>
    </motion.section>
  );
}