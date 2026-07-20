"use client";

import { useState } from "react";
import { NavUser } from "@/components/layout/nav-user";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationCenter } from "@/components/notifications";
import { GlobalSearch } from "@/components/global-search";
import { mockNotifications } from "@/mock/notifications";
import { markAsRead, markAllAsRead } from "@/lib/notifications";
import type { Notification, NotificationAction } from "@/types/notification";

export function AppHeader() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications((prev) => markAsRead(prev, notification.id));
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => markAllAsRead(prev));
  };

  const handleActionClick = (
    notification: Notification,
    action: NotificationAction
  ) => {
    console.log("Notification Action Clicked:", action, notification);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/70 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
      {/* Global Search */}
      <div className="flex w-full max-w-md items-center">
        <GlobalSearch />
      </div>

      {/* Right Actions */}
      <div className="ml-6 flex items-center gap-2">
        <NotificationCenter
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onActionClick={handleActionClick}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        <ThemeToggle />

        <div className="mx-2 h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        <NavUser />
      </div>
    </header>
  );
}