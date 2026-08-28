"use server";

import { revalidatePath } from "next/cache";
import {
  assertProductionRealData,
  requireDepartmentsManage,
  requireDepartmentsView,
} from "@/lib/auth/assert-data-management";
import { isRealDataEnabled } from "@/lib/config/flags";
import {
  mockDepartments,
  mockDepartmentSummary,
  getDepartmentById,
} from "@/mock/department";
import {
  listDepartments,
  getDepartment,
  getDepartmentSummary,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
  type DepartmentInput,
} from "@/lib/services/department.service";
import { toSafeActionResult } from "@/lib/errors/app-error";
import type {
  Department,
  DepartmentSummary,
  ResolvedDepartment,
} from "@/types/department";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export async function listDepartmentsAction(): Promise<
  ActionResult<ResolvedDepartment[]>
> {
  try {
    await requireDepartmentsView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return { success: true, data: mockDepartments };
  }
  try {
    const data = await listDepartments();
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getDepartmentAction(
  id: string
): Promise<ActionResult<ResolvedDepartment>> {
  try {
    await requireDepartmentsView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const row = getDepartmentById(id);
    if (!row) {
      return { success: false, error: "Department not found.", code: "NOT_FOUND" };
    }
    return { success: true, data: row };
  }
  try {
    const data = await getDepartment(id);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function getDepartmentSummaryAction(): Promise<
  ActionResult<DepartmentSummary>
> {
  try {
    await requireDepartmentsView();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return { success: true, data: mockDepartmentSummary };
  }
  try {
    const data = await getDepartmentSummary();
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function createDepartmentAction(
  input: DepartmentInput
): Promise<ActionResult<Department>> {
  try {
    await requireDepartmentsManage();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    return {
      success: true,
      data: {
        id: `dept-mock-${Date.now()}`,
        tenantId: "tenant-mock",
        name: input.name,
        code: input.code,
        description: input.description ?? null,
        managerId: input.managerId ?? null,
        parentDepartmentId: null,
        status: input.status,
        sortOrder: 0,
        budget: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
  try {
    const data = await createDepartment(input);
    revalidatePath("/dashboard/departments");
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function updateDepartmentAction(
  id: string,
  input: Partial<DepartmentInput>
): Promise<ActionResult<Department>> {
  try {
    await requireDepartmentsManage();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = getDepartmentById(id);
    if (!existing) {
      return { success: false, error: "Department not found.", code: "NOT_FOUND" };
    }
    return {
      success: true,
      data: {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
      } as Department,
    };
  }
  try {
    const data = await updateDepartment(id, input);
    revalidatePath("/dashboard/departments");
    revalidatePath(`/dashboard/departments/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function deactivateDepartmentAction(
  id: string
): Promise<ActionResult<Department>> {
  try {
    await requireDepartmentsManage();
    assertProductionRealData();
  } catch (error) {
    return toSafeActionResult(error);
  }

  if (!isRealDataEnabled()) {
    const existing = getDepartmentById(id);
    if (!existing) {
      return { success: false, error: "Department not found.", code: "NOT_FOUND" };
    }
    return { success: true, data: { ...existing, status: "INACTIVE" } };
  }
  try {
    const data = await deactivateDepartment(id);
    revalidatePath("/dashboard/departments");
    revalidatePath(`/dashboard/departments/${id}`);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
