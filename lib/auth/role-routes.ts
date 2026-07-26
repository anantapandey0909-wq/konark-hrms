import type { AuthRole } from "@/types/auth";

/**
 * Default route for each authenticated role.
 * These routes are used immediately after a successful login.
 */
export const ROLE_ROUTES: Record<AuthRole, string> = {
  ADMIN: "/dashboard",

  HR: "/dashboard/employees",

  ACCOUNTANT: "/dashboard/payroll",

  MANAGER: "/dashboard",

  SUPERVISOR: "/dashboard/attendance",

  EMPLOYEE: "/employee",
};

/**
 * Returns the default route for a given role.
 */
export function getRoleRoute(role: AuthRole): string {
  return ROLE_ROUTES[role];
}