import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  FileText,
  HelpCircle,
} from "lucide-react";

import type { SidebarNavigation } from "./navigation-types";

export const employeeNavigation: SidebarNavigation = {
  main: [
    {
      name: "Dashboard",
      href: "/dashboard/employee",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      href: "/dashboard/employee/profile",
      icon: User,
    },
    {
      name: "Attendance",
      href: "/dashboard/employee/attendance",
      icon: Clock,
    },
    {
      name: "Leave",
      href: "/dashboard/employee/leave",
      icon: CalendarDays,
    },
    {
      name: "Payroll",
      href: "/dashboard/employee/payroll",
      icon: FileText,
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