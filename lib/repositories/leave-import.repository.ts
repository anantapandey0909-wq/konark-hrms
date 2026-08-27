/**
 * Leave-import repository — tenant-scoped lookups and transactional creates.
 * companyId is always trusted (from getTenantPrisma), never from the client.
 */

import { LeaveStatus, type LeaveType, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

/** PENDING + APPROVED — typed as LeaveStatus[] so Prisma WhereInput accepts it. */
const ACTIVE_LEAVE_STATUSES: LeaveStatus[] = [
  LeaveStatus.PENDING,
  LeaveStatus.APPROVED,
];

/** Employees in the tenant matching any of the given employee codes. */
export async function findEmployeesByCodesForImport(
  companyId: string,
  codes: string[]
) {
  if (codes.length === 0) return [];
  const unique = Array.from(new Set(codes.map((c) => c.trim()).filter(Boolean)));
  if (unique.length === 0) return [];

  return prisma.employee.findMany({
    where: tenantScope(companyId, {
      employeeCode: { in: unique },
    }),
    select: {
      id: true,
      employeeCode: true,
      firstName: true,
      lastName: true,
      status: true,
    },
  });
}

/**
 * Existing PENDING/APPROVED leave for the given employees (batch).
 * Used for in-memory exact-duplicate and overlap checks (avoids N+1).
 *
 * IMPORTANT: Do not pass string-literal status arrays through tenantScope —
 * they widen to string[] and fail LeaveRequestWhereInput.
 */
export async function findActiveLeavesForEmployees(
  companyId: string,
  employeeIds: string[]
) {
  if (employeeIds.length === 0) return [];
  const unique = Array.from(new Set(employeeIds.filter(Boolean)));
  if (unique.length === 0) return [];

  const where: Prisma.LeaveRequestWhereInput = {
    companyId,
    employeeId: { in: unique },
    status: { in: ACTIVE_LEAVE_STATUSES },
  };

  return prisma.leaveRequest.findMany({
    where,
    select: {
      id: true,
      employeeId: true,
      leaveType: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });
}

/** Batch leave balances for soft insufficient-balance checks (same year). */
export async function findLeaveBalancesForEmployees(
  companyId: string,
  employeeIds: string[],
  year: number
) {
  if (employeeIds.length === 0) return [];
  const unique = Array.from(new Set(employeeIds.filter(Boolean)));
  if (unique.length === 0) return [];

  const where: Prisma.LeaveBalanceWhereInput = {
    companyId,
    year,
    employeeId: { in: unique },
  };

  return prisma.leaveBalance.findMany({
    where,
    select: {
      employeeId: true,
      year: true,
      casualLeave: true,
      sickLeave: true,
      earnedLeave: true,
      maternityLeave: true,
      paternityLeave: true,
      compOff: true,
    },
  });
}

export async function findDuplicateLeaveRequests(
  companyId: string,
  employeeId: string,
  leaveType: LeaveType,
  startDate: Date,
  endDate: Date
) {
  const where: Prisma.LeaveRequestWhereInput = {
    companyId,
    employeeId,
    leaveType,
    startDate,
    endDate,
    status: { in: ACTIVE_LEAVE_STATUSES },
  };

  return prisma.leaveRequest.findMany({
    where,
  });
}

export async function findOverlappingForImport(
  companyId: string,
  employeeId: string,
  startDate: Date,
  endDate: Date
) {
  const where: Prisma.LeaveRequestWhereInput = {
    companyId,
    employeeId,
    status: { in: ACTIVE_LEAVE_STATUSES },
    startDate: { lte: endDate },
    endDate: { gte: startDate },
  };

  return prisma.leaveRequest.findMany({
    where,
  });
}

export async function createLeaveRequestInTx(
  tx: Prisma.TransactionClient,
  data: {
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    reason: string;
    appliedOn: Date;
    companyId: string;
    employeeId: string;
  }
) {
  return tx.leaveRequest.create({
    data: {
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: data.totalDays,
      reason: data.reason,
      appliedOn: data.appliedOn,
      status: LeaveStatus.PENDING,
      halfDaySession: data.leaveType === "HALF_DAY" ? "FIRST_HALF" : null,
      companyId: data.companyId,
      employeeId: data.employeeId,
    },
  });
}
