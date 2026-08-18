/**
 * Thin employee data adapter.
 * NEXT_PUBLIC_USE_REAL_DATA=true → server actions / DB
 * otherwise → mock data (unchanged)
 */

import { isRealDataEnabled } from "@/lib/config/flags";
import { mockEmployees } from "@/mock/employee";
import type { Employee } from "@/types/employee";
import {
  listEmployeesAction,
  getEmployeeAction,
  createEmployeeAction,
  updateEmployeeAction,
  deactivateEmployeeAction,
} from "@/app/actions/employees";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "@/lib/services/employee.service";

export async function fetchEmployees(filters?: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
}): Promise<Employee[]> {
  if (!isRealDataEnabled()) {
    return mockEmployees.filter((emp) => {
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const hay =
          `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.employeeId}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (
        filters?.departmentId &&
        filters.departmentId !== "ALL" &&
        emp.departmentId !== filters.departmentId
      ) {
        return false;
      }
      if (
        filters?.status &&
        filters.status !== "ALL" &&
        emp.status !== filters.status
      ) {
        return false;
      }
      if (
        filters?.employmentType &&
        filters.employmentType !== "ALL" &&
        emp.employmentType !== filters.employmentType
      ) {
        return false;
      }
      return true;
    });
  }

  const result = await listEmployeesAction(filters);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function fetchEmployee(id: string): Promise<Employee | null> {
  if (!isRealDataEnabled()) {
    return mockEmployees.find((e) => e.id === id) ?? null;
  }
  const result = await getEmployeeAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function saveEmployee(
  input: CreateEmployeeInput
): Promise<Employee> {
  if (!isRealDataEnabled()) {
    const created: Employee = {
      id: `emp-mock-${Date.now()}`,
      tenantId: input.employeeId ? "tenant-mock" : "tenant-mock",
      employeeId: input.employeeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      avatarUrl: input.avatarUrl || null,
      departmentId: input.departmentId,
      managerId: input.managerId ?? null,
      designation: input.designation,
      status: input.status,
      employmentType: input.employmentType,
      workLocation: null,
      joiningDate: input.joiningDate,
      relievingDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return created;
  }
  const result = await createEmployeeAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchEmployee(
  id: string,
  input: UpdateEmployeeInput
): Promise<Employee> {
  if (!isRealDataEnabled()) {
    const existing = mockEmployees.find((e) => e.id === id);
    if (!existing) throw new Error("Employee not found.");
    return { ...existing, ...input, updatedAt: new Date().toISOString() } as Employee;
  }
  const result = await updateEmployeeAction(id, input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function removeEmployee(id: string): Promise<Employee> {
  if (!isRealDataEnabled()) {
    const existing = mockEmployees.find((e) => e.id === id);
    if (!existing) throw new Error("Employee not found.");
    return { ...existing, status: "TERMINATED" };
  }
  const result = await deactivateEmployeeAction(id);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
