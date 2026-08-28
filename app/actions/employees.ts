"use server";

import { revalidatePath } from "next/cache";
import {
  assertProductionRealData,
  requireEmployeesCreate,
  requireEmployeesDelete,
  requireEmployeesUpdate,
  requireEmployeesView,
} from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import { mockEmployees } from "@/mock/employee";
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
} from "@/lib/services/employee.service";
import { toSafeActionResult } from "@/lib/errors/app-error";
import type { Employee } from "@/types/employee";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

function filterMockEmployees(
  filters?: {
    search?: string;
    departmentId?: string;
    status?: string;
    employmentType?: string;
  }
): Employee[] {
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

export async function listEmployeesAction(filters?: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
}): Promise<ActionResult<Employee[]>> {
  try {
    await requireEmployeesView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return { success: true, data: filterMockEmployees(filters) };
  }
  try {
    const data = await listEmployees(filters);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getEmployeeAction(
  id: string
): Promise<ActionResult<Employee>> {
  try {
    await requireEmployeesView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const emp = mockEmployees.find((e) => e.id === id);
    if (!emp) {
      return { success: false, error: "Employee not found.", code: "NOT_FOUND" };
    }
    return { success: true, data: emp };
  }
  try {
    const data = await getEmployee(id);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function createEmployeeAction(
  input: CreateEmployeeInput
): Promise<ActionResult<Employee>> {
  try {
    await requireEmployeesCreate();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const created: Employee = {
      id: `emp-mock-${Date.now()}`,
      tenantId: "tenant-mock",
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
    return { success: true, data: created };
  }
  try {
    const data = await createEmployee(input);
    revalidatePath("/dashboard/employees");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function updateEmployeeAction(
  id: string,
  input: UpdateEmployeeInput
): Promise<ActionResult<Employee>> {
  try {
    await requireEmployeesUpdate();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = mockEmployees.find((e) => e.id === id);
    if (!existing) {
      return { success: false, error: "Employee not found.", code: "NOT_FOUND" };
    }
    return {
      success: true,
      data: {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
      } as Employee,
    };
  }
  try {
    const data = await updateEmployee(id, input);
    revalidatePath("/dashboard/employees");
    revalidatePath(`/dashboard/employees/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function deactivateEmployeeAction(
  id: string
): Promise<ActionResult<Employee>> {
  try {
    await requireEmployeesDelete();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = mockEmployees.find((e) => e.id === id);
    if (!existing) {
      return { success: false, error: "Employee not found.", code: "NOT_FOUND" };
    }
    return { success: true, data: { ...existing, status: "TERMINATED" } };
  }
  try {
    const data = await deactivateEmployee(id);
    revalidatePath("/dashboard/employees");
    revalidatePath(`/dashboard/employees/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
