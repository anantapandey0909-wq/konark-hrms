/**
 * Bulk employee service — validation, preview (read-only), transactional execute.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as bulkRepo from "@/lib/repositories/bulk-employee.repository";
import * as departmentRepo from "@/lib/repositories/department.repository";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  BULK_EMPLOYEE_ACTIONS,
  BULK_EMPLOYEE_MAX_BATCH,
  type BulkEmployeeAction,
  type BulkEmployeeExecuteResult,
  type BulkEmployeeOperationInput,
  type BulkEmployeePreviewResult,
  type BulkEmployeePreviewRow,
} from "@/types/bulk-operation";

function assertSupportedAction(
  action: string
): asserts action is BulkEmployeeAction {
  if (!(BULK_EMPLOYEE_ACTIONS as readonly string[]).includes(action)) {
    throw new AppError(
      "VALIDATION",
      "This bulk action is not supported."
    );
  }
}

function normalizeInput(input: BulkEmployeeOperationInput) {
  assertSupportedAction(input.action);
  const employeeIds = Array.from(
    new Set((input.employeeIds ?? []).map((id) => id.trim()).filter(Boolean))
  );
  if (employeeIds.length === 0) {
    throw new AppError("VALIDATION", "Select at least one employee.");
  }
  if (employeeIds.length > BULK_EMPLOYEE_MAX_BATCH) {
    throw new AppError(
      "VALIDATION",
      `Bulk operations are limited to ${BULK_EMPLOYEE_MAX_BATCH} employees.`
    );
  }
  return {
    action: input.action as BulkEmployeeAction,
    employeeIds,
    targetDepartmentId: input.targetDepartmentId?.trim() || null,
    targetManagerId: input.targetManagerId?.trim() || null,
  };
}

function deptLabel(emp: {
  department?: {
    departmentName?: string | null;
    departmentCode?: string | null;
  } | null;
}): string {
  return (
    emp.department?.departmentName || emp.department?.departmentCode || "—"
  );
}

function managerLabel(emp: {
  manager?: {
    firstName?: string;
    lastName?: string;
    employeeCode?: string;
  } | null;
}): string {
  if (!emp.manager) return "—";
  return `${emp.manager.firstName} ${emp.manager.lastName} (${emp.manager.employeeCode})`;
}

export async function previewBulkEmployeeOperation(
  input: BulkEmployeeOperationInput
): Promise<BulkEmployeePreviewResult> {
  const { companyId } = await getTenantPrisma();
  const normalized = normalizeInput(input);

  const employees = await bulkRepo.findEmployeesByIds(
    companyId,
    normalized.employeeIds
  );
  const foundIds = new Set(employees.map((e) => e.id));

  let targetDeptName = "";
  if (normalized.action === "transfer-dept") {
    if (!normalized.targetDepartmentId) {
      throw new AppError("VALIDATION", "Select a target department.");
    }
    const dept = await departmentRepo.findDepartmentById(
      companyId,
      normalized.targetDepartmentId
    );
    if (!dept) {
      throw new AppError(
        "VALIDATION",
        "Target department not found in your organization."
      );
    }
    targetDeptName = dept.departmentName;
  }

  let targetManagerLabel = "";
  if (normalized.action === "assign-manager") {
    if (!normalized.targetManagerId) {
      throw new AppError("VALIDATION", "Select a target manager.");
    }
    const mgr = await employeeRepo.findEmployeeById(
      companyId,
      normalized.targetManagerId
    );
    if (!mgr) {
      throw new AppError(
        "VALIDATION",
        "Target manager not found in your organization."
      );
    }
    targetManagerLabel = `${mgr.firstName} ${mgr.lastName} (${mgr.employeeCode})`;
  }

  const rows: BulkEmployeePreviewRow[] = [];

  for (const id of normalized.employeeIds) {
    if (!foundIds.has(id)) {
      rows.push({
        employeeId: id,
        employeeCode: "—",
        employeeName: "Unknown",
        departmentName: "—",
        currentValue: "—",
        newValue: "—",
        status: "invalid",
        notes: "Employee not found in your organization.",
      });
      continue;
    }

    const emp = employees.find((e) => e.id === id)!;
    const name = `${emp.firstName} ${emp.lastName}`;
    const departmentName = deptLabel(emp);

    if (normalized.action === "activate") {
      const already = emp.status === "ACTIVE";
      rows.push({
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: name,
        departmentName,
        currentValue: emp.status,
        newValue: "ACTIVE",
        status: already ? "warning" : "valid",
        notes: already
          ? "Already ACTIVE — will be skipped."
          : "Status will be set to ACTIVE.",
      });
      continue;
    }

    if (normalized.action === "deactivate") {
      const already = emp.status === "TERMINATED";
      rows.push({
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: name,
        departmentName,
        currentValue: emp.status,
        newValue: "TERMINATED",
        status: already ? "warning" : "valid",
        notes: already
          ? "Already TERMINATED — will be skipped."
          : "Status will be set to TERMINATED.",
      });
      continue;
    }

    if (normalized.action === "transfer-dept") {
      const same = emp.departmentId === normalized.targetDepartmentId;
      rows.push({
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: name,
        departmentName,
        currentValue: departmentName,
        newValue: targetDeptName,
        status: same ? "warning" : "valid",
        notes: same
          ? "Already in target department — will be skipped."
          : "Department will be updated.",
      });
      continue;
    }

    if (normalized.targetManagerId === emp.id) {
      rows.push({
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: name,
        departmentName,
        currentValue: managerLabel(emp),
        newValue: targetManagerLabel,
        status: "invalid",
        notes: "Employee cannot be assigned as their own manager.",
      });
      continue;
    }

    const sameMgr = emp.managerId === normalized.targetManagerId;
    rows.push({
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: name,
      departmentName,
      currentValue: managerLabel(emp),
      newValue: targetManagerLabel,
      status: sameMgr ? "warning" : "valid",
      notes: sameMgr
        ? "Already reports to this manager — will be skipped."
        : "Manager will be updated.",
    });
  }

  const validCount = rows.filter((r) => r.status === "valid").length;
  const invalidCount = rows.filter((r) => r.status === "invalid").length;
  const warningCount = rows.filter((r) => r.status === "warning").length;

  return {
    action: normalized.action,
    rows,
    selectedCount: rows.length,
    validCount,
    invalidCount,
    warningCount,
    skippedCount: warningCount,
    canCommit: validCount > 0 && invalidCount === 0,
  };
}

export async function executeBulkEmployeeOperation(
  input: BulkEmployeeOperationInput
): Promise<BulkEmployeeExecuteResult> {
  const { companyId, user } = await getTenantPrisma();
  const preview = await previewBulkEmployeeOperation(input);

  if (preview.invalidCount > 0) {
    throw new AppError(
      "VALIDATION",
      "Resolve invalid rows before committing the bulk operation."
    );
  }

  const toProcess = preview.rows.filter((r) => r.status === "valid");
  if (toProcess.length === 0) {
    throw new AppError(
      "VALIDATION",
      "No employees require changes for this action."
    );
  }

  const normalized = normalizeInput(input);
  const errors: { employeeId: string; message: string }[] = [];
  let processedCount = 0;

  try {
    await prisma.$transaction(async (tx) => {
      for (const row of toProcess) {
        let data: Prisma.EmployeeUpdateInput = {};

        if (normalized.action === "activate") {
          data = { status: "ACTIVE" };
        } else if (normalized.action === "deactivate") {
          data = { status: "TERMINATED" };
        } else if (normalized.action === "transfer-dept") {
          // EmployeeUpdateInput uses relation syntax, not scalar departmentId
          data = {
            department: {
              connect: { id: normalized.targetDepartmentId! },
            },
          };
        } else if (normalized.action === "assign-manager") {
          // Same for self-relation manager — use connect, not scalar managerId
          data = {
            manager: {
              connect: { id: normalized.targetManagerId! },
            },
          };
        }

        const updated = await bulkRepo.updateEmployeeInTx(
          tx,
          companyId,
          row.employeeId,
          data
        );
        if (!updated) {
          throw new AppError(
            "NOT_FOUND",
            `Employee ${row.employeeCode} is no longer available.`
          );
        }
        processedCount += 1;
      }
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("[bulk-employee] transaction failed", err);
    throw new AppError(
      "INTERNAL",
      "Failed to commit bulk employee updates. No changes were applied."
    );
  }

  for (const row of toProcess) {
    const auditAction =
      normalized.action === "activate"
        ? "BULK_EMPLOYEE_ACTIVATED"
        : normalized.action === "deactivate"
          ? "BULK_EMPLOYEE_DEACTIVATED"
          : normalized.action === "transfer-dept"
            ? "BULK_EMPLOYEE_DEPARTMENT_TRANSFERRED"
            : "BULK_EMPLOYEE_MANAGER_ASSIGNED";

    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: auditAction,
      entity: "Employee",
      entityId: row.employeeId,
      metadata: {
        source: "bulk_operation",
        operation: normalized.action,
        employeeCode: row.employeeCode,
        previousValue: row.currentValue,
        newValue: row.newValue,
      },
    });
  }

  return {
    action: normalized.action,
    processedCount,
    failedCount: errors.length,
    totalRequested: normalized.employeeIds.length,
    errors,
  };
}
