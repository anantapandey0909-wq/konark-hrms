/**
 * Server-side authorization helpers backed by ROLE_PERMISSIONS.
 *
 * Used by Data Management imports/bulk and domain CRUD server actions.
 * Must be called inside server actions — never rely on UI alone.
 * Applies in both mock and real-data modes.
 */

import type { AuthUser } from "@/types/auth";
import { requireCurrentUser } from "@/lib/auth/current-user";
import {
  getPermissions,
  type RolePermissions,
} from "@/lib/auth/permissions";
import { isRealDataEnabled } from "@/lib/config/flags";
import { AppError } from "@/lib/errors/app-error";

export type PermissionCheck = (permissions: RolePermissions) => boolean;

/**
 * Whether the user has the given permission according to ROLE_PERMISSIONS.
 * Super-admin bypasses the matrix (same as operational override elsewhere).
 */
export function hasPermission(
  user: AuthUser,
  check: PermissionCheck
): boolean {
  if (user.isSuperAdmin) return true;
  return check(getPermissions(user.role));
}

/**
 * Require authenticated session + ROLE_PERMISSIONS check.
 * Throws AppError FORBIDDEN / UnauthenticatedError.
 */
export async function requirePermission(
  check: PermissionCheck,
  message = "You do not have permission to perform this action."
): Promise<AuthUser> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, check)) {
    throw new AppError("FORBIDDEN", message);
  }
  return user;
}

/**
 * Defense-in-depth: production must not serve mock data paths.
 * Development mock mode remains allowed.
 */
export function assertProductionRealData(): void {
  if (process.env.NODE_ENV === "production" && !isRealDataEnabled()) {
    throw new AppError(
      "INTERNAL",
      "Application misconfiguration: real data mode is required in production."
    );
  }
}

// ---------------------------------------------------------------------------
// Data Management
// ---------------------------------------------------------------------------

export async function requireCanImportEmployees(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.create,
    "You do not have permission to import employees."
  );
}

export async function requireCanImportDepartments(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.departments.manage,
    "You do not have permission to import departments."
  );
}

export async function requireCanImportLeave(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.leave.approve,
    "You do not have permission to import leave requests."
  );
}

export async function requireCanImportAttendance(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.attendance.mark,
    "You do not have permission to import attendance."
  );
}

export async function requireCanImportPayroll(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.payroll.upload,
    "You do not have permission to import payroll."
  );
}

export async function requireCanBulkUpdateEmployees(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.update,
    "You do not have permission to run bulk employee operations."
  );
}

// ---------------------------------------------------------------------------
// Domain CRUD — map to existing ROLE_PERMISSIONS only
// ---------------------------------------------------------------------------

export async function requireEmployeesView(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.view,
    "You do not have permission to view employees."
  );
}

export async function requireEmployeesCreate(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.create,
    "You do not have permission to create employees."
  );
}

export async function requireEmployeesUpdate(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.update,
    "You do not have permission to update employees."
  );
}

export async function requireEmployeesDelete(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.delete,
    "You do not have permission to deactivate employees."
  );
}

export async function requireDepartmentsView(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.departments.view,
    "You do not have permission to view departments."
  );
}

export async function requireDepartmentsManage(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.departments.manage,
    "You do not have permission to manage departments."
  );
}

export async function requireLeaveView(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.leave.view,
    "You do not have permission to view leave."
  );
}

/** Create / edit / cancel leave (self-service or HR on behalf). */
export async function requireLeaveApply(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.leave.apply || p.leave.approve,
    "You do not have permission to submit leave requests."
  );
}

export async function requireLeaveApprove(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.leave.approve,
    "You do not have permission to approve or reject leave."
  );
}

export async function requireAttendanceView(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.attendance.view,
    "You do not have permission to view attendance."
  );
}

/** Admin/supervisor recording of attendance rows. */
export async function requireAttendanceMark(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.attendance.mark,
    "You do not have permission to record attendance."
  );
}

/**
 * Self-service check-in / check-out.
 * EMPLOYEE has attendance.view but not mark — allow any role with view
 * so the employee portal remains usable without inventing permissions.
 */
export async function requireAttendanceSelfService(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.attendance.view,
    "You do not have permission to check in or check out."
  );
}

export async function requirePayrollView(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.payroll.view,
    "You do not have permission to view payroll."
  );
}

export async function requirePayrollGenerate(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.payroll.generate,
    "You do not have permission to create or update payroll."
  );
}

export async function requireReportsView(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.reports.view,
    "You do not have permission to view reports."
  );
}
