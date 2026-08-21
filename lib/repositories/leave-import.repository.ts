/**
 * Leave-import repository — tenant-scoped lookups and bulk create support.
 * Does not redesign the main leave.repository used by Leave Management.
 */

import type { LeaveType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
