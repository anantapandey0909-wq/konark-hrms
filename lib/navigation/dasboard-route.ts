import type { AuthRole } from "@/types/auth";

export function getDashboardRoute(role: AuthRole): string {
  switch (role) {
    case "MANAGER":
      return "/dashboard/manager";

    case "SUPERVISOR":
      return "/dashboard/supervisor";

    case "EMPLOYEE":
      return "/dashboard/employee";

    default:
      return "/dashboard";
  }
}