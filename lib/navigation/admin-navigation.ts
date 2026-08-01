import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  CalendarDays,
  FileText,
  BarChart3,
  Database,
  Settings,
  HelpCircle,
} from "lucide-react";

import type { SidebarNavigation } from "./navigation-types";

export const adminNavigation: SidebarNavigation = {
  main: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
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
      name: "Data Management",
      href: "/dashboard/data-management",
      icon: Database,
    },
  ],

  secondary: [
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      name: "Support",
      href: "/dashboard/support",
      icon: HelpCircle,
    },
  ],
};