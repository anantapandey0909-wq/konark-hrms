import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  CalendarDays,
  BarChart3,
  HelpCircle,
} from "lucide-react";

import type { SidebarNavigation } from "./navigation-types";

export const hrNavigation: SidebarNavigation = {
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