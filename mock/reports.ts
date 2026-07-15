import {
  Users,
  Clock,
  CalendarDays,
  Wallet,
} from "lucide-react";

import type { ReportSummary } from "@/types/reports";

export const reportSummaries: ReportSummary[] = [
  {
    id: "employees",
    title: "Total Employees",
    value: 128,
    description: "Currently active employees",
    trend: {
      value: 8.4,
      isPositive: true,
    },
    icon: Users,
  },
  {
    id: "attendance",
    title: "Attendance Rate",
    value: "96.2%",
    description: "Average monthly attendance",
    trend: {
      value: 1.8,
      isPositive: true,
    },
    icon: Clock,
  },
  {
    id: "leave",
    title: "Leave Requests",
    value: 14,
    description: "Pending approvals",
    trend: {
      value: 5.3,
      isPositive: false,
    },
    icon: CalendarDays,
  },
  {
    id: "payroll",
    title: "Monthly Payroll",
    value: "₹24.8L",
    description: "Processed this month",
    trend: {
      value: 3.2,
      isPositive: true,
    },
    icon: Wallet,
  },
];