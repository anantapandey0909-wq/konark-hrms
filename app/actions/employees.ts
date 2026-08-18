"use server";

import { revalidatePath } from "next/cache";
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

export async function listEmployeesAction(filters?: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
}): Promise<ActionResult<Employee[]>> {
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
    const data = await deactivateEmployee(id);
    revalidatePath("/dashboard/employees");
    revalidatePath(`/dashboard/employees/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
