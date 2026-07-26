import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  Clock,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import type { AuthRole } from "@/types/auth";

export interface SidebarNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: AuthRole[];
}

export const mainNavigation: SidebarNavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "ADMIN",
      "HR",
      "ACCOUNTANT",
      "MANAGER",
      "SUPERVISOR",
      "EMPLOYEE",
    ],
  },
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: Users,
    roles: ["ADMIN", "HR", "MANAGER"],
  },
  {
    name: "Departments",
    href: "/dashboard/departments",
    icon: Briefcase,
    roles: ["ADMIN", "HR"],
  },
  {
    name: "Attendance",
    href: "/dashboard/attendance",
    icon: Clock,
    roles: [
      "ADMIN",
      "HR",
      "MANAGER",
      "SUPERVISOR",
      "EMPLOYEE",
    ],
  },
  {
    name: "Leave",
    href: "/dashboard/leave",
    icon: CalendarDays,
    roles: [
      "ADMIN",
      "HR",
      "MANAGER",
      "EMPLOYEE",
    ],
  },
  {
    name: "Payroll",
    href: "/dashboard/payroll",
    icon: FileText,
    roles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: [
      "ADMIN",
      "HR",
      "ACCOUNTANT",
      "MANAGER",
      "SUPERVISOR",
    ],
  },
];

export const secondaryNavigation: SidebarNavItem[] = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["ADMIN"],
  },
  {
    name: "Support",
    href: "/dashboard/support",
    icon: HelpCircle,
    roles: [
      "ADMIN",
      "HR",
      "ACCOUNTANT",
      "MANAGER",
      "SUPERVISOR",
      "EMPLOYEE",
    ],
  },
];