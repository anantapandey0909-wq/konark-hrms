"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReportSummary } from "@/types/reports";

interface ReportSummaryCardProps {
  summary: ReportSummary;
}

export default function ReportSummaryCard({
  summary,
}: ReportSummaryCardProps) {
  const { title, value, description, trend, icon: Icon } = summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-zinc-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
            <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>

      {trend && (
        <div
          className={`mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            trend.isPositive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {trend.isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}

          {trend.value}%
        </div>
      )}
    </motion.div>
  );
}