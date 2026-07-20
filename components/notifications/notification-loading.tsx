"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const LOADING_ROWS = Array.from(
  { length: 6 },
  (_, i) => `loading-row-${i}`
);

export function NotificationLoading() {
  return (
    <motion.div
      role="status"
      aria-busy="true"
      aria-label="Loading notifications"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-3 p-4"
    >
      {LOADING_ROWS.map((row, index) => (
        <motion.div
          key={row}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "tween",
            ease: "easeOut",
            duration: 0.25,
            delay: index * 0.03,
          }}
          className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-3.5 shadow-sm transition-all dark:border-zinc-800/60 dark:bg-zinc-950/40"
        >
          {/* Avatar / Icon Placeholder */}
          <Skeleton className="h-9 w-9 shrink-0 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80" />

          {/* Content Area */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-1/3 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
              <Skeleton className="h-3 w-12 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>

            <div className="space-y-1.5">
              <Skeleton className="h-3 w-11/12 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              <Skeleton className="h-3 w-2/3 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>

            {/* Alternating Action Button Placeholder */}
            {index % 2 === 0 && (
              <div className="pt-1">
                <Skeleton className="h-7 w-20 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
              </div>
            )}
          </div>

          {/* Read Status Indicator Placeholder */}
          <div className="flex h-5 items-center justify-center pl-1" aria-hidden="true">
            <Skeleton className="h-2 w-2 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}