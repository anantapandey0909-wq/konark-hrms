import type { AuthRole } from "@/types/auth";

import { adminNavigation } from "./admin-navigation";
import { hrNavigation } from "./hr-navigation";
import { managerNavigation } from "./manager-navigation";
import { employeeNavigation } from "./employee-navigation";
import { supervisorNavigation } from "./supervisor-navigation";
import { accountantNavigation } from "./accountant-navigation";
import type { SidebarNavigation } from "./navigation-types";

export function getNavigationByRole(
  role: AuthRole
): SidebarNavigation {
  switch (role) {
    case "ADMIN":
      return adminNavigation;

    case "HR":
      return hrNavigation;

    case "MANAGER":
      return managerNavigation;

    case "SUPERVISOR":
      return supervisorNavigation;

    case "ACCOUNTANT":
      return accountantNavigation;

    case "EMPLOYEE":
      return employeeNavigation;

    default:
      return employeeNavigation;
  }
}
