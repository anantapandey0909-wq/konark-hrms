"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function SettingsLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="space-y-6 w-full"
      aria-hidden="true"
    >
      {/* Settings Module Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Separator />

      {/* Main Structural Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar Navigation Panel Skeleton */}
        <aside className="md:col-span-3 space-y-6">
          {/* Group 1: Core */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-16" /> {/* Category Header */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Group 2: Workforce */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" /> {/* Category Header */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Group 3: Preferences */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" /> {/* Category Header */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </aside>

        {/* Presentational Form Card Content Skeleton */}
        <main className="md:col-span-9">
          <div className="border rounded-lg bg-card shadow-sm w-full">
            {/* Card Header Skeleton */}
            <div className="p-6 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>

            <Separator />

            {/* Card Content Form Placeholder Skeletons */}
            <div className="p-6 space-y-6">
              {/* Form Input Grid Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" /> {/* Label */}
                  <Skeleton className="h-10 w-full rounded-md" /> {/* Input Field */}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" /> {/* Label */}
                  <Skeleton className="h-10 w-full rounded-md" /> {/* Input Field */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" /> {/* Label */}
                  <Skeleton className="h-10 w-full rounded-md" /> {/* Input Field */}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" /> {/* Label */}
                  <Skeleton className="h-10 w-full rounded-md" /> {/* Input Field */}
                </div>
              </div>

              <Separator />

              {/* Automation Switches Segment Placeholder */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-40" /> {/* Segment Header */}
                <div className="border rounded-lg p-3 flex justify-between items-center bg-card/50">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-80" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" /> {/* Switch Toggle */}
                </div>
              </div>
            </div>

            <Separator />

            {/* Card Footer Button Placeholders */}
            <div className="p-6 flex justify-end gap-3">
              <Skeleton className="h-10 w-20 rounded-md" /> {/* Reset Button */}
              <Skeleton className="h-10 w-32 rounded-md" /> {/* Save Button */}
            </div>
          </div>
        </main>

      </div>
    </motion.div>
  );
}