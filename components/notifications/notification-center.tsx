"use client";

import { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { unreadCount } from "@/lib/notifications";
import { NotificationTrigger } from "./notification-trigger";
import { NotificationPanel } from "./notification-panel";
import type { Notification, NotificationAction } from "@/types/notification";

export interface NotificationCenterProps {
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

export function NotificationCenter({
  notifications,
  loading = false,
  onNotificationClick,
  onActionClick,
  onMarkAllAsRead,
  className,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);

  const computedUnreadCount = useMemo(() => {
    return unreadCount(notifications);
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <NotificationTrigger
          unreadCount={computedUnreadCount}
          className={className}
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-screen max-w-md p-0 border-none bg-transparent shadow-none"
      >
        <NotificationPanel
          notifications={notifications}
          loading={loading}
          onNotificationClick={handleNotificationClick}
          onActionClick={onActionClick}
          onMarkAllAsRead={onMarkAllAsRead}
        />
      </PopoverContent>
    </Popover>
  );
}