import type { AuthRole } from "@/types/auth";

export interface AppPermissions {
  readonly employees: {
    readonly view: boolean;
    readonly create: boolean;
    readonly edit: boolean;
    readonly delete: boolean;
  };
  readonly departments: {
    readonly view: boolean;
    readonly create: boolean;
    readonly edit: boolean;
    readonly delete: boolean;
  };
  readonly attendance: {
    readonly view: boolean;
    readonly clockIn: boolean;
    readonly clockOut: boolean;
    readonly manage: boolean;
  };
  readonly leave: {
    readonly view: boolean;
    readonly apply: boolean;
    readonly approve: boolean;
  };
  readonly payroll: {
    readonly view: boolean;
    readonly manage: boolean;
  };
  readonly reports: {
    readonly view: boolean;
    readonly export: boolean;
  };
  readonly settings: {
    readonly view: boolean;
    readonly manage: boolean;
  };
}

/**
 * Compile-time mapping representing a valid string dotted-path inside AppPermissions.
 * Automatically handles nestings to prevent compilation of invalid access paths.
 */
export type PermissionPath = {
  [K in keyof AppPermissions]: K extends string
    ? `${K}.${keyof AppPermissions[K] & string}`
    : never;
}[keyof AppPermissions];

const DEFAULT_PERMISSIONS = {
  employees: { view: false, create: false, edit: false, delete: false },
  departments: { view: false, create: false, edit: false, delete: false },
  attendance: { view: false, clockIn: false, clockOut: false, manage: false },
  leave: { view: false, apply: false, approve: false },
  payroll: { view: false, manage: false },
  reports: { view: false, export: false },
  settings: { view: false, manage: false },
} as const satisfies AppPermissions;

export const ROLE_PERMISSIONS = {
  ADMIN: {
    employees: { view: true, create: true, edit: true, delete: true },
    departments: { view: true, create: true, edit: true, delete: true },
    attendance: { view: true, clockIn: true, clockOut: true, manage: true },
    leave: { view: true, apply: true, approve: true },
    payroll: { view: true, manage: true },
    reports: { view: true, export: true },
    settings: { view: true, manage: true },
  },
  HR: {
    employees: { view: true, create: true, edit: true, delete: false },
    departments: { view: true, create: true, edit: true, delete: false },
    attendance: { view: true, clockIn: true, clockOut: true, manage: true },
    leave: { view: true, apply: true, approve: true },
    payroll: { view: false, manage: false },
    reports: { view: true, export: true },
    settings: { view: true, manage: false },
  },
  ACCOUNTANT: {
    employees: { view: false, create: false, edit: false, delete: false },
    departments: { view: false, create: false, edit: false, delete: false },
    attendance: { view: false, clockIn: false, clockOut: false, manage: false },
    leave: { view: false, apply: false, approve: false },
    payroll: { view: true, manage: true },
    reports: { view: true, export: true },
    settings: { view: false, manage: false },
  },
  MANAGER: {
    employees: { view: true, create: false, edit: false, delete: false },
    departments: { view: false, create: false, edit: false, delete: false },
    attendance: { view: true, clockIn: true, clockOut: true, manage: true },
    leave: { view: true, apply: true, approve: true },
    payroll: { view: false, manage: false },
    reports: { view: true, export: false },
    settings: { view: false, manage: false },
  },
  SUPERVISOR: {
    employees: { view: false, create: false, edit: false, delete: false },
    departments: { view: false, create: false, edit: false, delete: false },
    attendance: { view: true, clockIn: true, clockOut: true, manage: false },
    leave: { view: false, apply: false, approve: false },
    payroll: { view: false, manage: false },
    reports: { view: true, export: false },
    settings: { view: false, manage: false },
  },
  EMPLOYEE: {
    employees: { view: false, create: false, edit: false, delete: false },
    departments: { view: false, create: false, edit: false, delete: false },
    attendance: { view: true, clockIn: true, clockOut: true, manage: false },
    leave: { view: true, apply: true, approve: false },
    payroll: { view: false, manage: false },
    reports: { view: false, export: false },
    settings: { view: false, manage: false },
  },
} as const satisfies Record<AuthRole, AppPermissions>;

/**
 * Type guard validating if a string representation maps to a concrete enterprise role.
 */
export function isAuthRole(role: unknown): role is AuthRole {
  return typeof role === "string" && role in ROLE_PERMISSIONS;
}

/**
 * Returns read-only permissions mapping associated with the evaluated role.
 */
export function getPermissions(role: string | null | undefined): AppPermissions {
  return isAuthRole(role) ? ROLE_PERMISSIONS[role] : DEFAULT_PERMISSIONS;
}

/**
 * Validates role permission access against a fully typed dotted path string.
 */
export function hasPermission(role: string | null | undefined, permissionPath: PermissionPath): boolean {
  if (!role || !permissionPath) return false;

  const permissions = getPermissions(role);
  const keys = permissionPath.split(".");

  let current: unknown = permissions;
  for (const key of keys) {
    if (typeof current !== "object" || current === null || !(key in current)) {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current === true;
}

/**
 * Type-safe match evaluating active role state against a readonly list of allowed scopes.
 */
export function hasRole(userRole: string | null | undefined, allowedRoles: readonly AuthRole[]): boolean {
  return isAuthRole(userRole) && allowedRoles.includes(userRole);
}