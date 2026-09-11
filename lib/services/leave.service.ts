/**
 * Leave service — business rules, balance deduction, tenant isolation.
 */

import type { LeaveStatus, LeaveType, HalfDaySession } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/db/prisma-with-tenant";
import { AppError } from "@/lib/errors/app-error";
import * as leaveRepo from "@/lib/repositories/leave.repository";
import * as employeeRepo from "@/lib/repositories/employee.repository";
import {
  mapLeaveRequestToFrontend,
  mapLeaveBalanceToFrontend,
  calculateLeaveDays,
  balanceFieldForLeaveType,
} from "@/lib/mappers/leave.mapper";
import { writeAuditLog } from "@/lib/services/audit.service";
import {
  createLeaveSchema,
  updateLeaveSchema,
  type CreateLeaveInput,
  type UpdateLeaveInput,
} from "@/lib/validation/leave";
import { getPermissions } from "@/lib/auth/permissions";
import type {
  LeaveRequest,
  LeaveBalance,
  LeaveStatsSummary,
} from "@/types/leave";
import type { AuthRole, AuthUser } from "@/types/auth";

const APPROVER_ROLES: readonly AuthRole[] = [
  "ADMIN",
  "HR",
  "MANAGER",
  "SUPERVISOR",
];

function parseDateOnly(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

function assertCanApprove(role: AuthRole) {
  if (!APPROVER_ROLES.includes(role)) {
    throw new AppError(
      "FORBIDDEN",
      "You are not authorized to approve or reject leave requests.",
      403
    );
  }
}

/**
 * Organizational leave visibility / on-behalf authority.
 * Mirrors leave.approve (and super-admin) — not inventing new permissions.
 */
function canViewOrgLeave(user: AuthUser): boolean {
  if (user.isSuperAdmin) return true;
  return getPermissions(user.role).leave.approve;
}

/**
 * Self-service actors (leave.apply without leave.approve) may only act for
 * their own Employee record. Approvers / super-admin may act on behalf.
 */
function canCreateOnBehalf(user: AuthUser): boolean {
  return canViewOrgLeave(user);
}

/**
 * Resolve the authenticated user's linked Employee id within the tenant.
 */
async function resolveSessionEmployeeId(
  companyId: string,
  userId: string
): Promise<string | null> {
  const linked = await prisma.employee.findFirst({
    where: { companyId, userId },
    select: { id: true },
  });
  return linked?.id ?? null;
}

export async function listLeaveRequests(filters?: {
  status?: string;
  leaveType?: string;
  employeeId?: string;
  departmentId?: string;
}): Promise<LeaveRequest[]> {
  const { companyId, user } = await getTenantPrisma();
  const scoped = { ...(filters ?? {}) };

  if (!canViewOrgLeave(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId) {
      return [];
    }
    // Force self-scope; ignore client employeeId.
    scoped.employeeId = ownId;
  }

  const rows = await leaveRepo.findLeaveRequestsByCompany(companyId, scoped);
  return rows.map(mapLeaveRequestToFrontend);
}

export async function getLeaveRequest(id: string): Promise<LeaveRequest> {
  const { companyId, user } = await getTenantPrisma();
  const row = await leaveRepo.findLeaveRequestById(companyId, id);
  if (!row) {
    throw new AppError("NOT_FOUND", "Leave request not found.", 404);
  }

  if (!canViewOrgLeave(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId || row.employeeId !== ownId) {
      throw new AppError("NOT_FOUND", "Leave request not found.", 404);
    }
  }

  return mapLeaveRequestToFrontend(row);
}

/**
 * Leave dashboard KPIs via DB counts (not full-row load).
 * Semantics unchanged: all-time status totals + onLeaveToday for APPROVED spanning today (UTC midnight).
 * Scope: org-wide for approvers/super-admin; self-only otherwise.
 */
export async function getLeaveStats(): Promise<LeaveStatsSummary> {
  const { companyId, user } = await getTenantPrisma();
  const scope: leaveRepo.LeaveStatsScope = {};

  if (!canViewOrgLeave(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId) {
      return {
        totalRequests: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
        onLeaveToday: 0,
      };
    }
    scope.employeeId = ownId;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return leaveRepo.countLeaveStats(companyId, scope, today);
}

export async function getLeaveBalance(
  employeeId: string
): Promise<LeaveBalance> {
  const { companyId, user } = await getTenantPrisma();

  let targetEmployeeId = employeeId;

  if (!canViewOrgLeave(user)) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId) {
      throw new AppError(
        "NOT_FOUND",
        "Leave balance not found.",
        404
      );
    }
    if (employeeId && employeeId !== ownId) {
      throw new AppError("NOT_FOUND", "Leave balance not found.", 404);
    }
    targetEmployeeId = ownId;
  }

  const emp = await employeeRepo.findEmployeeById(companyId, targetEmployeeId);
  if (!emp) {
    throw new AppError("NOT_FOUND", "Employee not found.", 404);
  }
  const year = new Date().getUTCFullYear();
  let balance = await leaveRepo.findLeaveBalance(
    companyId,
    targetEmployeeId,
    year
  );
  if (!balance) {
    balance = await leaveRepo.upsertLeaveBalance(
      companyId,
      targetEmployeeId,
      year,
      {}
    );
  }
  return mapLeaveBalanceToFrontend(balance);
}

export async function createLeaveRequest(
  input: CreateLeaveInput
): Promise<LeaveRequest> {
  const { companyId, user, prisma: db } = await getTenantPrisma();
  const parsed = createLeaveSchema.parse(input);

  let targetEmployeeId = parsed.employeeId;

  // Self-service: leave.apply without leave.approve → own employee only
  if (!canCreateOnBehalf(user)) {
    const linked = await db.employee.findFirst({
      where: { companyId, userId: user.id },
    });
    if (!linked) {
      throw new AppError(
        "VALIDATION",
        "No employee profile is linked to your account."
      );
    }
    if (targetEmployeeId !== linked.id) {
      throw new AppError(
        "FORBIDDEN",
        "You may only submit leave requests for yourself.",
        403
      );
    }
    targetEmployeeId = linked.id;
  }

  const employee = await employeeRepo.findEmployeeById(
    companyId,
    targetEmployeeId
  );
  if (!employee) {
    throw new AppError(
      "VALIDATION",
      "Employee not found in your organization."
    );
  }
  if (employee.status !== "ACTIVE") {
    throw new AppError(
      "VALIDATION",
      "Leave can only be created for active employees."
    );
  }

  const startDate = parseDateOnly(parsed.startDate);
  const endDate = parseDateOnly(parsed.endDate);
  if (endDate < startDate) {
    throw new AppError("VALIDATION", "End date cannot be before start date.");
  }

  const isHalfDay =
    parsed.leaveType === "HALF_DAY" || parsed.isHalfDay === true;
  const totalDays = calculateLeaveDays(
    startDate,
    endDate,
    parsed.leaveType,
    isHalfDay
  );

  const overlaps = await leaveRepo.findOverlappingLeaves(
    companyId,
    targetEmployeeId,
    startDate,
    endDate
  );
  if (overlaps.length > 0) {
    throw new AppError(
      "CONFLICT",
      "This request overlaps an existing pending or approved leave."
    );
  }

  // Soft balance check on create (hard check on approve)
  const field = balanceFieldForLeaveType(parsed.leaveType);
  if (field) {
    const year = startDate.getUTCFullYear();
    const balance = await leaveRepo.findLeaveBalance(
      companyId,
      targetEmployeeId,
      year
    );
    if (balance && (balance[field] as number) < totalDays) {
      throw new AppError(
        "VALIDATION",
        "Insufficient leave balance for this request."
      );
    }
  }

  const created = await leaveRepo.createLeaveRequest({
    leaveType: parsed.leaveType as LeaveType,
    startDate,
    endDate,
    totalDays,
    reason: parsed.reason,
    halfDaySession: isHalfDay
      ? ((parsed.halfDaySession as HalfDaySession) ?? "FIRST_HALF")
      : null,
    appliedOn: new Date(),
    status: "PENDING",
    attachment: parsed.attachment ?? null,
    company: { connect: { id: companyId } },
    employee: { connect: { id: targetEmployeeId } },
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "LEAVE_REQUEST_CREATED",
    entity: "LeaveRequest",
    entityId: created.id,
    metadata: {
      employeeId: targetEmployeeId,
      leaveType: parsed.leaveType,
      totalDays,
    },
  });

  return mapLeaveRequestToFrontend(created);
}

export async function updateLeaveRequest(
  id: string,
  input: UpdateLeaveInput
): Promise<LeaveRequest> {
  const { companyId, user } = await getTenantPrisma();
  const parsed = updateLeaveSchema.parse(input);

  const existing = await leaveRepo.findLeaveRequestById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Leave request not found.", 404);
  }

  const isOrgApprover = canViewOrgLeave(user);

  if (!isOrgApprover) {
    const ownId = await resolveSessionEmployeeId(companyId, user.id);
    if (!ownId || existing.employeeId !== ownId) {
      throw new AppError("NOT_FOUND", "Leave request not found.", 404);
    }
    // Non-approvers cannot reassign leave to another employee.
    if (parsed.employeeId && parsed.employeeId !== existing.employeeId) {
      throw new AppError(
        "FORBIDDEN",
        "You cannot reassign a leave request to another employee.",
        403
      );
    }
  }

  if (existing.status !== "PENDING") {
    throw new AppError(
      "CONFLICT",
      "Only pending leave requests can be edited."
    );
  }

  const startDate = parsed.startDate
    ? parseDateOnly(parsed.startDate)
    : existing.startDate;
  const endDate = parsed.endDate
    ? parseDateOnly(parsed.endDate)
    : existing.endDate;
  if (endDate < startDate) {
    throw new AppError("VALIDATION", "End date cannot be before start date.");
  }

  const leaveType = (parsed.leaveType ?? existing.leaveType) as string;
  const isHalfDay = leaveType === "HALF_DAY" || parsed.isHalfDay === true;
  const totalDays = calculateLeaveDays(
    startDate,
    endDate,
    leaveType,
    isHalfDay
  );

  let employeeId = existing.employeeId;
  if (
    isOrgApprover &&
    parsed.employeeId &&
    parsed.employeeId !== existing.employeeId
  ) {
    const target = await employeeRepo.findEmployeeById(
      companyId,
      parsed.employeeId
    );
    if (!target) {
      throw new AppError(
        "VALIDATION",
        "Employee not found in your organization."
      );
    }
    if (target.status !== "ACTIVE") {
      throw new AppError(
        "VALIDATION",
        "Leave can only be assigned to active employees."
      );
    }
    employeeId = parsed.employeeId;
  }

  const overlaps = await leaveRepo.findOverlappingLeaves(
    companyId,
    employeeId,
    startDate,
    endDate,
    id
  );
  if (overlaps.length > 0) {
    throw new AppError(
      "CONFLICT",
      "This request overlaps an existing pending or approved leave."
    );
  }

  const updated = await leaveRepo.updateLeaveRequest(companyId, id, {
    ...(employeeId !== existing.employeeId
      ? { employee: { connect: { id: employeeId } } }
      : {}),
    ...(parsed.leaveType
      ? { leaveType: parsed.leaveType as LeaveType }
      : {}),
    startDate,
    endDate,
    totalDays,
    ...(parsed.reason !== undefined ? { reason: parsed.reason } : {}),
    halfDaySession: isHalfDay
      ? ((parsed.halfDaySession as HalfDaySession) ??
        existing.halfDaySession ??
        "FIRST_HALF")
      : null,
  });

  if (!updated) {
    throw new AppError("NOT_FOUND", "Leave request not found.", 404);
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "LEAVE_REQUEST_UPDATED",
    entity: "LeaveRequest",
    entityId: id,
  });

  return mapLeaveRequestToFrontend(updated);
}

export async function approveLeaveRequest(
  id: string,
  remarks?: string | null
): Promise<LeaveRequest> {
  const { companyId, user } = await getTenantPrisma();
  assertCanApprove(user.role);

  const existing = await leaveRepo.findLeaveRequestById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Leave request not found.", 404);
  }
  if (existing.status !== "PENDING") {
    throw new AppError("CONFLICT", "Only pending requests can be approved.");
  }

  const year = existing.startDate.getUTCFullYear();
  const field = balanceFieldForLeaveType(existing.leaveType);

  // Resolve approver employee id for FK (approvedBy is Employee)
  const approverEmployee = await prisma.employee.findFirst({
    where: { companyId, userId: user.id },
  });

  const updated = await prisma.$transaction(async (tx) => {
    if (field) {
      let balance = await tx.leaveBalance.findFirst({
        where: {
          companyId,
          employeeId: existing.employeeId,
          year,
        },
      });
      if (!balance) {
        balance = await tx.leaveBalance.create({
          data: {
            companyId,
            employeeId: existing.employeeId,
            year,
            casualLeave: 12,
            sickLeave: 8,
            earnedLeave: 15,
            maternityLeave: 0,
            paternityLeave: 0,
            compOff: 0,
          },
        });
      }
      const current = balance[field] as number;
      if (current < existing.totalDays) {
        throw new AppError(
          "VALIDATION",
          "Insufficient leave balance for approval."
        );
      }
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: { [field]: current - existing.totalDays },
      });
    }

    return tx.leaveRequest.update({
      where: { id },
      data: {
        status: "APPROVED" as LeaveStatus,
        approvedOn: new Date(),
        approvalRemarks: remarks ?? null,
        ...(approverEmployee
          ? { approvedBy: { connect: { id: approverEmployee.id } }
          : {}),
      },
      include: {
        employee: {
          include: { department: { select: { departmentName: true } } },
        },
        approvedBy: { select: { firstName: true, lastName: true } },
      },
    });
  });

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "LEAVE_REQUEST_APPROVED",
    entity: "LeaveRequest",
    entityId: id,
  });
  if (field) {
    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "LEAVE_BALANCE_UPDATED",
      entity: "LeaveBalance",
      entityId: existing.employeeId,
      metadata: { leaveRequestId: id, deducted: existing.totalDays },
    });
  }

  return mapLeaveRequestToFrontend(updated);
}

export async function rejectLeaveRequest(
  id: string,
  remarks?: string | null
): Promise<LeaveRequest> {
  const { companyId, user } = await getTenantPrisma();
  assertCanApprove(user.role);

  const existing = await leaveRepo.findLeaveRequestById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Leave request not found.", 404);
  }
  if (existing.status !== "PENDING") {
    throw new AppError("CONFLICT", "Only pending requests can be rejected.");
  }

  const approverEmployee = await prisma.employee.findFirst({
    where: { companyId, userId: user.id },
  });

  const updated = await leaveRepo.updateLeaveRequest(companyId, id, {
    status: "REJECTED",
    approvedOn: new Date(),
    approvalRemarks: remarks ?? null,
    ...(approverEmployee
      ? { approvedBy: { connect: { id: approverEmployee.id } } }
      : {}),
  });

  if (!updated) {
    throw new AppError("NOT_FOUND", "Leave request not found.", 404);
  }

  await writeAuditLog({
    companyId,
    actorId: user.id,
    action: "LEAVE_REQUEST_REJECTED",
    entity: "LeaveRequest",
    entityId: id,
  });

  return mapLeaveRequestToFrontend(updated);
}

export async function cancelLeaveRequest(id: string): Promise<LeaveRequest> {
  const { companyId, user, prisma: db } = await getTenantPrisma();

  const existing = await leaveRepo.findLeaveRequestById(companyId, id);
  if (!existing) {
    throw new AppError("NOT_FOUND", "Leave request not found.", 404);
  }

  // Owner or approver roles may cancel pending; only approvers restore approved balance
  const linked = await db.employee.findFirst({
    where: { companyId, userId: user.id },
  });
  const isOwner = linked?.id === existing.employeeId;
  const isApprover = APPROVER_ROLES.includes(user.role);

  if (existing.status === "PENDING") {
    if (!isOwner && !isApprover) {
      throw new AppError(
        "FORBIDDEN",
        "Not allowed to cancel this request.",
        403
      );
    }
    const updated = await leaveRepo.updateLeaveRequest(companyId, id, {
      status: "CANCELLED",
    });
    if (!updated) {
      throw new AppError("NOT_FOUND", "Leave request not found.", 404);
    }
    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "LEAVE_REQUEST_CANCELLED",
      entity: "LeaveRequest",
      entityId: id,
    });
    return mapLeaveRequestToFrontend(updated);
  }

  if (existing.status === "APPROVED") {
    if (!isApprover) {
      throw new AppError(
        "FORBIDDEN",
        "Only managers/HR can cancel approved leave.",
        403
      );
    }
    const year = existing.startDate.getUTCFullYear();
    const field = balanceFieldForLeaveType(existing.leaveType);

    const updated = await prisma.$transaction(async (tx) => {
      if (field) {
        const balance = await tx.leaveBalance.findFirst({
          where: {
            companyId,
            employeeId: existing.employeeId,
            year,
          },
        });
        if (balance) {
          await tx.leaveBalance.update({
            where: { id: balance.id },
            data: {
              [field]: (balance[field] as number) + existing.totalDays,
            },
          });
        }
      }
      return tx.leaveRequest.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: {
          employee: {
            include: { department: { select: { departmentName: true } } },
          },
          approvedBy: { select: { firstName: true, lastName: true } },
        },
      });
    });

    await writeAuditLog({
      companyId,
      actorId: user.id,
      action: "LEAVE_REQUEST_CANCELLED",
      entity: "LeaveRequest",
      entityId: id,
    });
    return mapLeaveRequestToFrontend(updated);
  }

  throw new AppError(
    "CONFLICT",
    "This leave request cannot be cancelled in its current status."
  );
}
