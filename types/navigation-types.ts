import type { LucideIcon } from "lucide-react";

export type UserRole =
  | "SUPER_ADMIN"
  | "HR"
  | "MANAGER"
  | "EMPLOYEE";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}