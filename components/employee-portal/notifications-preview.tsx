"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationItem } from "@/types/employee-portal";
import { Bell, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotificationsPreviewProps {
  readonly initialNotifications: readonly NotificationItem[];
}

export function NotificationsPreview({ initialNotifications }: NotificationsPreviewProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [...initialNotifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    toast.success("Notification read confirmation updated.");
  };

  const getIndicatorColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "CRITICAL":
        return "text-rose-500 fill-rose-500";
      case "WARNING":
        return "text-amber-500 fill-amber-500";
      case "SUCCESS":
        return "text-emerald-500 fill-emerald-500";
      default:
        return "text-indigo-500 fill-indigo-500";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
            Recent Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
              {unreadCount}
            </div>
          )}
        </div>
        <Bell className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No active notifications.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-slate-850 ${
                item.isRead ? "opacity-60" : "opacity-100"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Circle className={`mt-1.5 h-2 w-2 shrink-0 ${getIndicatorColor(item.type)}`} />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {item.description}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              {!item.isRead && (
                <Button
                  onClick={() => handleMarkAsRead(item.id)}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full text-slate-400 hover:text-slate-900"
                  title="Mark as Read"
                  aria-label="Mark notification as read"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}