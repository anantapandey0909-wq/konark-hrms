/**
 * Server-side authorization for Data Management imports and bulk operations.
 *
 * Derives allow/deny from the existing ROLE_PERMISSIONS matrix in
 * lib/auth/permissions.ts — does not invent new permissions or role lists.
 *
 * Must be called inside server actions — never rely on UI alone.
 * Applies in both mock and real-data modes.
 */

import type { AuthUser } from "@/types/auth";
import { requireCurrentUser } from "@/lib/auth/current-user";
import {
  getPermissions,
  type RolePermissions,
} from "@/lib/auth/permissions";
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

/** Employee CSV import — creates employees → employees.create */
export async function requireCanImportEmployees(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.create,
    "You do not have permission to import employees."
  );
}

/** Department CSV import — departments.manage */
export async function requireCanImportDepartments(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.departments.manage,
    "You do not have permission to import departments."
  );
}

/** Leave CSV import (org-wide) — leave.approve (not self-service leave.apply) */
export async function requireCanImportLeave(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.leave.approve,
    "You do not have permission to import leave requests."
  );
}

/** Attendance CSV import — attendance.mark */
export async function requireCanImportAttendance(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.attendance.mark,
    "You do not have permission to import attendance."
  );
}

/** Payroll CSV import — payroll.upload */
export async function requireCanImportPayroll(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.payroll.upload,
    "You do not have permission to import payroll."
  );
}

/** Bulk employee mutations (activate/deactivate/transfer/manager) — employees.update */
export async function requireCanBulkUpdateEmployees(): Promise<AuthUser> {
  return requirePermission(
    (p) => p.employees.update,
    "You do not have permission to run bulk employee operations."
  );
}
