/**
 * Thin department data adapter.
 * NEXT_PUBLIC_USE_REAL_DATA=true → server actions / DB
 * otherwise → mock data
 */

import { isRealDataEnabled } from "@/lib/config/flags";
import {
  mockDepartments,
  mockDepartmentSummary,
  getDepartmentById,
} from "@/mock/department";
import type {
  Department,
  DepartmentSummary,
  ResolvedDepartment,
  DepartmentFormData,
} from "@/types/department";
import {
  listDepartmentsAction,
  getDepartmentAction,
  getDepartmentSummaryAction,
  createDepartmentAction,
  updateDepartmentAction,
  deactivateDepartmentAction,
} from "@/app/actions/departments";

export async function fetchDepartments(): Promise<ResolvedDepartment[]> {
  if (!isRealDataEnabled()) {
    return mockDepartments;
  }
  const result = await listDepartmentsAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchDepartment(
  id: string
): Promise<ResolvedDepartment | null> {
  if (!isRealDataEnabled()) {
    return getDepartmentById(id);
  }
  const result = await getDepartmentAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function fetchDepartmentSummary(): Promise<DepartmentSummary> {
  if (!isRealDataEnabled()) {
    return mockDepartmentSummary;
  }
  const result = await getDepartmentSummaryAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function saveDepartment(
  input: DepartmentFormData
): Promise<Department> {
  const payload = {
    name: input.name,
    code: input.code,
    description: input.description,
    status: input.status,
    managerId: input.managerId,
  };

  if (!isRealDataEnabled()) {
    return {
      id: `dept-mock-${Date.now()}`,
      tenantId: "tenant-mock",
      name: input.name,
      code: input.code,
      description: input.description,
      managerId: input.managerId,
      parentDepartmentId: input.parentDepartmentId,
      status: input.status,
      sortOrder: input.sortOrder,
      budget: input.budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const result = await createDepartmentAction(payload);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchDepartment(
  id: string,
  input: Partial<DepartmentFormData>
): Promise<Department> {
  if (!isRealDataEnabled()) {
    const existing = getDepartmentById(id);
    if (!existing) throw new Error("Department not found.");
    return { ...existing, ...input, updatedAt: new Date().toISOString() };
  }

  const result = await updateDepartmentAction(id, {
    name: input.name,
    code: input.code,
    description: input.description,
    status: input.status,
    managerId: input.managerId,
  });
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function removeDepartment(id: string): Promise<Department> {
  if (!isRealDataEnabled()) {
    const existing = getDepartmentById(id);
    if (!existing) throw new Error("Department not found.");
    return { ...existing, status: "INACTIVE" };
  }
  const result = await deactivateDepartmentAction(id);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
