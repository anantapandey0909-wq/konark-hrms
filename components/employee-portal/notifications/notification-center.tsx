"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, ShieldAlert, Sparkles } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: "PERSONAL" | "SYSTEM";
  timestamp: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  readonly notifications: readonly NotificationItem[];
  readonly onMarkRead: (id: string) => void;
  readonly onMarkAllRead: () => void;
}

export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationCenterProps) {
  const getCategoryStyles = (category: NotificationItem["category"]) => {
    switch (category) {
      case "PERSONAL":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/10 dark:text-sky-400 dark:border-sky-900/30";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/10 dark:text-indigo-400 dark:border-indigo-900/30";
    }
  };

  const getFormattedTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-400" />
            Alert Inbox
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-bold">
              {unreadCount} New
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={onMarkAllRead}
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            Mark All Read
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <ScrollArea className="h-[360px] pr-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Sparkles className="h-8 w-8 mb-2 text-slate-300" />
              <p className="text-xs">All clear! No active notifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-slate-850 ${
                    item.isRead ? "opacity-60" : "opacity-100"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${getCategoryStyles(item.category)} text-[8px] uppercase tracking-wider`}>
                        {item.category}
                      </Badge>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getFormattedTime(item.timestamp)}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {item.description}
                    </p>
                  </div>

                  {!item.isRead && (
                    <Button
                      onClick={() => onMarkRead(item.id)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full text-slate-400 hover:text-slate-900"
                      title="Mark as Read"
                      aria-label="Mark single notification as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}