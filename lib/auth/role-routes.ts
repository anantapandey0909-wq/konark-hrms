import type { AuthRole } from "@/types/auth";

// ==============================================================================
// Dashboard Routes
// ==============================================================================

export const DASHBOARD_ROUTES = {
  ROOT: "/dashboard",
  EMPLOYEES: "/dashboard/employees",
  PAYROLL: "/dashboard/payroll",
  ATTENDANCE: "/dashboard/attendance",
  EMPLOYEE_PORTAL: "/dashboard/employee",
} as const;

const DEFAULT_ROUTE = DASHBOARD_ROUTES.ROOT;

// ==============================================================================
// Default Landing Routes
// ==============================================================================

export const DEFAULT_ROLE_ROUTES: Record<AuthRole, string> = {
  ADMIN: DEFAULT_ROUTE,

  HR: DASHBOARD_ROUTES.EMPLOYEES,

  ACCOUNTANT: DASHBOARD_ROUTES.PAYROLL,

  MANAGER: "/dashboard/manager",

  SUPERVISOR: DASHBOARD_ROUTES.ATTENDANCE,

  EMPLOYEE: DASHBOARD_ROUTES.EMPLOYEE_PORTAL,
};

// ==============================================================================
// Helpers
// ==============================================================================

export function getRoleRoute(role: AuthRole): string {
  return DEFAULT_ROLE_ROUTES[role] ?? DEFAULT_ROUTE;
}