import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CheckSquare,
  BarChart3,
  HelpCircle,
} from "lucide-react";

import type { SidebarNavigation } from "./navigation-types";

export const managerNavigation: SidebarNavigation = {
  main: [
    {
      name: "Dashboard",
      href: "/dashboard/manager",
      icon: LayoutDashboard,
    },
    {
      name: "My Team",
      href: "/dashboard/manager/team",
      icon: Users,
    },
    {
      name: "Attendance",
      href: "/dashboard/manager/attendance",
      icon: Clock,
    },
    {
      name: "Approvals",
      href: "/dashboard/manager/approvals",
      icon: CheckSquare,
    },
    {
      name: "Reports",
      href: "/dashboard/manager/reports",
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