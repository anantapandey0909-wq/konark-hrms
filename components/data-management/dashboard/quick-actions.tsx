'use client';

import Link from "next/link";
import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Users,
  Clock,
  Calendar,
  Coins,
  Download,
  Terminal,
  ArrowRight,
  Database,
} from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const actionsList: ActionItem[] = [
  {
    id: "employee-import",
    title: "Employee Import",
    description:
      "Bulk map employee records, system profiles, and initial metadata.",
    href: "/dashboard/data-management/employee-import",
    icon: Users,
  },
  {
    id: "attendance-import",
    title: "Attendance Import",
    description:
      "Sync daily clock times, biometric terminal records, and shift schedules.",
    href: "/dashboard/data-management/attendance-import",
    icon: Clock,
  },
  {
    id: "leave-import",
    title: "Leave Import",
    description:
      "Update annual leave counters, active absences, and historic claims.",
    href: "/dashboard/data-management/leave-import",
    icon: Calendar,
  },
  {
    id: "payroll-import",
    title: "Payroll Import",
    description:
      "Modify salary scales, performance bonuses, and allowance values.",
    href: "/dashboard/data-management/payroll-import",
    icon: Coins,
  },
  {
    id: "master-data",
    title: "Master Data",
    description:
      "Manage departments, shifts, holidays and organization records.",
    href: "/dashboard/data-management/master-data",
    icon: Database,
  },
  {
    id: "export-center",
    title: "Export Center",
    description:
      "Export HRMS data and download generated reports.",
    href: "/dashboard/data-management/export-center",
    icon: Download,
  },
  {
    id: "history",
    title: "History",
    description:
      "Review previous imports, exports and processing logs.",
    href: "/dashboard/data-management/history",
    icon: Terminal,
  },
  {
    id: "bulk-operations",
    title: "Bulk Operations",
    description:
      "Perform bulk updates across multiple HR modules.",
    href: "/dashboard/data-management/bulk-operations",
    icon: Database,
  },
];

const cardHoverVariants: Variants = {
  rest: {
    borderColor: "rgba(228,228,231,0.6)",
  },
  hover: {
    borderColor: "rgba(79,70,229,0.4)",
    transition: {
      duration: 0.2,
    },
  },
};

const arrowMoveVariants: Variants = {
  rest: {
    x: 0,
  },
  hover: {
    x: 3,
    transition: {
      type: "spring",
      stiffness: 150,
    },
  },
};

export default function QuickActions() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4.5 w-4.5 text-zinc-500" />

          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Quick Actions
            </CardTitle>

            <CardDescription className="text-xs text-zinc-500">
              Quickly access the most frequently used Data Management tools.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3.5">
        {actionsList.map((act) => {
          const Icon = act.icon;

          return (
            <Link
              key={act.id}
              href={act.href}
              className="block"
            >
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                className="flex items-start justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3 overflow-hidden">
                  <div className="p-2 bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 mt-0.5 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="overflow-hidden space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200">
                      {act.title}
                    </h4>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                </div>

                <motion.div
                  variants={arrowMoveVariants}
                  className="self-center shrink-0 pl-1 text-zinc-400 dark:text-zinc-500"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}