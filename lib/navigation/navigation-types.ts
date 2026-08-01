import type { LucideIcon } from "lucide-react";
import type { AuthRole } from "@/types/auth";

export interface SidebarNavItem {
  readonly name: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export interface SidebarNavigation {
  readonly main: readonly SidebarNavItem[];
  readonly secondary: readonly SidebarNavItem[];
}

export interface NavigationFactory {
  readonly role: AuthRole;
  readonly navigation: SidebarNavigation;
}