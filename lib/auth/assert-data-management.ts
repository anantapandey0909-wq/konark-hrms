/**
 * Server-side authorization for Data Management imports and bulk operations.
 * Mirrors Export Center's assertCanExport pattern: deny EMPLOYEE; tighten payroll.
 *
 * Must be called inside server actions / services — never rely on UI alone.
 * Applies in both mock and real-data modes.
 */

import type { AuthRole, AuthUser } from "@/types/auth";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { AppError } from "@/lib/errors/app-error";

/**
 * Non-employee staff roles that may run general Data Management mutations
 * (employee/leave/attendance/department import, bulk employee ops).
 * Aligns with Export Center: any authenticated role except EMPLOYEE.
 */
const DATA_MANAGEMENT_ROLES: readonly AuthRole[] = [
  "ADMIN",
  "HR",
  "ACCOUNTANT",
  "MANAGER",
  "SUPERVISOR",
];

/** Payroll import — same restriction as Export Center payroll module. */
const PAYROLL_IMPORT_ROLES: readonly AuthRole[] = [
  "ADMIN",
  "HR",
  "ACCOUNTANT",
];

export function assertCanManageData(user: AuthUser): void {
  if (user.isSuperAdmin) return;

  if (user.role === "EMPLOYEE") {
    throw new AppError(
      "FORBIDDEN",
      "Employees cannot use Data Management imports or bulk operations."
    );
  }

  if (!DATA_MANAGEMENT_ROLES.includes(user.role)) {
    throw new AppError(
      "FORBIDDEN",
      "You are not authorized to use Data Management operations."
    );
  }
}

export function assertCanImportPayroll(user: AuthUser): void {
  if (user.isSuperAdmin) return;

  if (!PAYROLL_IMPORT_ROLES.includes(user.role)) {
    throw new AppError(
      "FORBIDDEN",
      "Payroll import requires HR, Accountant, or Admin role."
    );
  }
}

/** Session + role gate for general Data Management mutations/previews. */
export async function requireCanManageData(): Promise<AuthUser> {
  const user = await requireCurrentUser();
  assertCanManageData(user);
  return user;
}

/** Session + role gate for payroll import preview/commit. */
export async function requireCanImportPayroll(): Promise<AuthUser> {
  const user = await requireCurrentUser();
  assertCanImportPayroll(user);
  return user;
}
