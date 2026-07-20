"use client";

import { motion } from "framer-motion";
import { type LucideIcon, Inbox } from "lucide-react";

export interface NotificationEmptyProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

export function NotificationEmpty({
  icon: Icon = Inbox,
  title = "No notifications",
  description = "You're all caught up. New notifications will appear here.",
}: NotificationEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-8 text-center min-h-[280px]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800/80 dark:text-zinc-500 mb-4">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        {title}
      </h3>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}