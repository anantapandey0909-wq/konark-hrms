/**
 * Map Prisma Department rows ↔ frontend Department / ResolvedDepartment.
 * parentDepartmentId, sortOrder, budget are not in Phase 1 schema —
 * returned as null/0 so existing UI contracts stay stable.
 */

import type {
  Department,
  DepartmentStatus,
  ResolvedDepartment,
} from "@/types/department";
import type { Employee } from "@/types/employee";
import type { DepartmentStatus as PrismaDepartmentStatus } from "@prisma/client";

export type PrismaDepartmentRow = {
  id: string;
  companyId: string;
  departmentCode: string;
  departmentName: string;
  description: string | null;
  status: PrismaDepartmentStatus;
  managerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { employees: number };
};

export function toFrontendDepartmentStatus(
  status: PrismaDepartmentStatus
): DepartmentStatus {
  return status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
}

export function toPrismaDepartmentStatus(
  status: DepartmentStatus
): PrismaDepartmentStatus {
  return status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
}

export function mapDepartmentToFrontend(row: PrismaDepartmentRow): Department {
  return {
    id: row.id,
    tenantId: row.companyId,
    name: row.departmentName,
    code: row.departmentCode,
    description: row.description,
    managerId: row.managerId,
    parentDepartmentId: null,
    status: toFrontendDepartmentStatus(row.status),
    sortOrder: 0,
    budget: null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapResolvedDepartment(
  row: PrismaDepartmentRow,
  manager: Employee | null = null
): ResolvedDepartment {
  return {
    ...mapDepartmentToFrontend(row),
    manager,
    parentDepartment: null,
    employeeCount: row._count?.employees ?? 0,
  };
}
