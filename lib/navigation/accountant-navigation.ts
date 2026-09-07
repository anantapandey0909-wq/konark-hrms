import {
  FileText,
  BarChart3,
  Users,
  Briefcase,
  Clock,
  CalendarDays,
  HelpCircle,
} from "lucide-react";

import type { SidebarNavigation } from "./navigation-types";

/**
 * ACCOUNTANT navigation — only routes aligned with ROLE_PERMISSIONS:
 * payroll.view/generate/approve, reports.view/export,
 * employees.view, departments.view, attendance.view, leave.view.
 * No settings, no data-management mutations, no employee portal.
 */
export const accountantNavigation: SidebarNavigation = {
  main: [
    {
      name: "Payroll",
      href: "/dashboard/payroll",
      icon: FileText,
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      name: "Employees",
      href: "/dashboard/employees",
      icon: Users,
    },
    {
      name: "Departments",
      href: "/dashboard/departments",
      icon: Briefcase,
    },
    {
      name: "Attendance",
      href: "/dashboard/attendance",
      icon: Clock,
    },
    {
      name: "Leave",
      href: "/dashboard/leave",
      icon: CalendarDays,
    },
  ],

  secondary: [
    {
      name: "Support",
      href: "/dashboard/support",
      icon: HelpCircle,
    },
  ],
};
