/**
 * Thin employee data adapter.
 * Mock vs real is decided inside app/actions/employees.ts ("use server").
 */

import type { Employee } from "@/types/employee";
import {
  listEmployeesAction,
  getEmployeeAction,
  createEmployeeAction,
  updateEmployeeAction,
  deactivateEmployeeAction,
} from "@/app/actions/employees";
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeListResult,
} from "@/lib/services/employee.service";

export async function fetchEmployees(filters?: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
  page?: number;
  pageSize?: number;
}): Promise<EmployeeListResult> {
  const result = await listEmployeesAction(filters);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function fetchEmployee(id: string): Promise<Employee | null> {
  const result = await getEmployeeAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function saveEmployee(
  input: CreateEmployeeInput
): Promise<Employee> {
  const result = await createEmployeeAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchEmployee(
  id: string,
  input: UpdateEmployeeInput
): Promise<Employee> {
  const result = await updateEmployeeAction(id, input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function removeEmployee(id: string): Promise<Employee> {
  const result = await deactivateEmployeeAction(id);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
