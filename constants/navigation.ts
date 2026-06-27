import {
  LayoutDashboard,
  Users,
  Building2,
  Clock3,
  CalendarCheck,
  Wallet,
  Briefcase,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

import { NavigationItem } from "@/types/navigation-types";

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
    roles: ["SUPER_ADMIN", "HR", "MANAGER"],
  },
  {
    title: "Departments",
    href: "/departments",
    icon: Building2,
    roles: ["SUPER_ADMIN", "HR"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Clock3,
    roles: ["SUPER_ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "Leave",
    href: "/leave",
    icon: CalendarCheck,
    roles: ["SUPER_ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "Payroll",
    href: "/payroll",
    icon: Wallet,
    roles: ["SUPER_ADMIN", "HR"],
  },
  {
    title: "Recruitment",
    href: "/recruitment",
    icon: Briefcase,
    roles: ["SUPER_ADMIN", "HR"],
  },
  {
    title: "Performance",
    href: "/performance",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "HR", "MANAGER"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["SUPER_ADMIN", "HR"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
];