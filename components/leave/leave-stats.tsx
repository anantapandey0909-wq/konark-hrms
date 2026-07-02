"use client";

import { motion, Variants } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileText,
  LucideIcon,
  Users,
  XCircle,
} from "lucide-react";

import LeaveSummaryCard from "./leave-summary-card";
import { LeaveStatsSummary } from "@/types/leave";

interface LeaveStatsProps {
  stats: LeaveStatsSummary;
}

interface LeaveStatCard {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  iconContainerClassName: string;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 16,
    },
  },
};

export default function LeaveStats({ stats }: LeaveStatsProps) {
  const summaryCards: LeaveStatCard[] = [
    {
      title: "Total Requests",
      value: stats.totalRequests,
      description: "Total leave requests",
      icon: FileText,
      iconClassName: "text-violet-600 dark:text-violet-400",
      iconContainerClassName:
        "bg-violet-50 border-violet-100 dark:bg-violet-950/40 dark:border-violet-900/30",
    },
    {
      title: "Pending Approval",
      value: stats.pending,
      description: "Awaiting approval",
      icon: Clock,
      iconClassName: "text-amber-600 dark:text-amber-400",
      iconContainerClassName:
        "bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/30",
    },
    {
      title: "Approved",
      value: stats.approved,
      description: "Approved leave requests",
      icon: CheckCircle2,
      iconClassName: "text-emerald-600 dark:text-emerald-400",
      iconContainerClassName:
        "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/30",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      description: "Rejected leave requests",
      icon: XCircle,
      iconClassName: "text-rose-600 dark:text-rose-400",
      iconContainerClassName:
        "bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/30",
    },
    {
      title: "On Leave Today",
      value: stats.onLeaveToday,
      description: "Employees currently on leave",
      icon: Users,
      iconClassName: "text-indigo-600 dark:text-indigo-400",
      iconContainerClassName:
        "bg-indigo-50 border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/30",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {summaryCards.map((card) => (
        <motion.div key={card.title} variants={itemVariants}>
          <LeaveSummaryCard
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            iconClassName={card.iconClassName}
            iconContainerClassName={card.iconContainerClassName}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}