import type { Employee } from "@/types/employee";

// ==============================================================================
// Department Status
// ==============================================================================

export const DEPARTMENT_STATUS = [
  "ACTIVE",
  "INACTIVE",
] as const;

export type DepartmentStatus =
  (typeof DEPARTMENT_STATUS)[number];

export type DepartmentStatusFilter =
  | "ALL"
  | DepartmentStatus;

// ==============================================================================
// Department
// ==============================================================================

export interface Department {
  readonly id: string;

  readonly tenantId: string;

  readonly name: string;

  readonly code: string;

  readonly description: string | null;

  readonly managerId: string | null;

  readonly parentDepartmentId: string | null;

  readonly status: DepartmentStatus;

  readonly sortOrder: number;

  /**
   * Frontend uses number.
   * Backend (Prisma) can map this to Decimal.
   */
  readonly budget: number | null;

  readonly createdAt: string;

  readonly updatedAt: string;
}

// ==============================================================================
// Resolved Department
// ==============================================================================

export interface ResolvedDepartment extends Department {
  readonly manager: Employee | null;

  readonly parentDepartment: Department | null;

  readonly employeeCount: number;
}

// ==============================================================================
// Summary
// ==============================================================================

export interface DepartmentSummary {
  readonly totalDepartments: number;

  readonly activeDepartments: number;

  readonly inactiveDepartments: number;

  readonly totalEmployees: number;
}

// ==============================================================================
// Forms
// ==============================================================================

export interface DepartmentFormData {
  readonly name: string;

  readonly code: string;

  readonly description: string | null;

  readonly managerId: string | null;

  readonly parentDepartmentId: string | null;

  readonly status: DepartmentStatus;

  readonly sortOrder: number;

  readonly budget: number | null;
}