import {
  Clock,
  CalendarDays,
  Users,
  Briefcase,
  BarChart3,
  HelpCircle,
} from "lucide-react";

import type { SidebarNavigation } from "./navigation-types";

/**
 * SUPERVISOR navigation — only routes aligned with ROLE_PERMISSIONS:
 * employees.view, departments.view, attendance.view/mark,
 * leave.view/apply, reports.view. No payroll, settings, or data-management.
 */
export const supervisorNavigation: SidebarNavigation = {
  main: [
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
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
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
