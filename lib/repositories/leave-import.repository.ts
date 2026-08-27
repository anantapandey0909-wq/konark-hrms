/**
 * Leave-import repository — tenant-scoped lookups and transactional creates.
 * companyId is always trusted (from getTenantPrisma), never from the client.
 */

import type { LeaveType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

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
 */
export async function findActiveLeavesForEmployees(
  companyId: string,
  employeeIds: string[]
) {
  if (employeeIds.length === 0) return [];
  const unique = Array.from(new Set(employeeIds.filter(Boolean)));
  if (unique.length === 0) return [];

  return prisma.leaveRequest.findMany({
    where: tenantScope(companyId, {
      employeeId: { in: unique },
      status: { in: ["PENDING", "APPROVED"] },
    }),
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

export async function findDuplicateLeaveRequests(
  companyId: string,
  employeeId: string,
  leaveType: LeaveType,
  startDate: Date,
  endDate: Date
) {
  return prisma.leaveRequest.findMany({
    where: {
      companyId,
      employeeId,
      leaveType,
      startDate,
      endDate,
      status: { in: ["PENDING", "APPROVED"] },
    },
  });
}

export async function findOverlappingForImport(
  companyId: string,
  employeeId: string,
  startDate: Date,
  endDate: Date
) {
  return prisma.leaveRequest.findMany({
    where: {
      companyId,
      employeeId,
      status: { in: ["PENDING", "APPROVED"] },
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
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
      status: "PENDING",
      halfDaySession: data.leaveType === "HALF_DAY" ? "FIRST_HALF" : null,
      companyId: data.companyId,
      employeeId: data.employeeId,
    },
  });
}
