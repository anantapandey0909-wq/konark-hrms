/**
 * Thin department data adapter.
 * Mock vs real is decided inside app/actions/departments.ts ("use server").
 */

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
  const result = await listDepartmentsAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchDepartment(
  id: string
): Promise<ResolvedDepartment | null> {
  const result = await getDepartmentAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function fetchDepartmentSummary(): Promise<DepartmentSummary> {
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

  const result = await createDepartmentAction(payload);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchDepartment(
  id: string,
  input: Partial<DepartmentFormData>
): Promise<Department> {
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
  const result = await deactivateDepartmentAction(id);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
