import { LeaveStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";
import type { LeaveStatsSummary } from "@/types/leave";

const leaveInclude = {
  employee: {
    include: {
      department: { select: { departmentName: true } },
    },
  },
  approvedBy: {
    select: { firstName: true, lastName: true },
  },
} as const;

export type LeaveListFilters = {
  status?: string;
  leaveType?: string;
  employeeId?: string;
  departmentId?: string;
};

/** Optional self-scope for stats (non-approvers). companyId always from session. */
export type LeaveStatsScope = {
  employeeId?: string;
};

function dayStart(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

const ACTIVE_LEAVE_STATUSES: LeaveStatus[] = [
  LeaveStatus.PENDING,
  LeaveStatus.APPROVED,
];

export async function findLeaveRequestsByCompany(
  companyId: string,
  filters: LeaveListFilters = {}
) {
  const where: Prisma.LeaveRequestWhereInput = tenantScope(companyId, {});

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumLeaveStatusFilter["equals"];
  }
  if (filters.leaveType && filters.leaveType !== "ALL") {
    where.leaveType = filters.leaveType as Prisma.EnumLeaveTypeFilter["equals"];
  }
  if (filters.employeeId) {
    where.employeeId = filters.employeeId;
  }
  if (filters.departmentId) {
    where.employee = { departmentId: filters.departmentId };
  }

  return prisma.leaveRequest.findMany({
    where,
    include: leaveInclude,
    orderBy: [{ appliedOn: "desc" }, { createdAt: "desc" }],
  });
}

/**
 * KPI counts via DB aggregation — does not load LeaveRequest rows.
 * Semantics match prior in-memory getLeaveStats():
 * - all-time totals by status (no period window)
 * - onLeaveToday: APPROVED where startDate <= today <= endDate
 */
export async function countLeaveStats(
  companyId: string,
  scope: LeaveStatsScope = {},
  today: Date
): Promise<LeaveStatsSummary> {
  const baseWhere: Prisma.LeaveRequestWhereInput = tenantScope(companyId, {});
  if (scope.employeeId) {
    baseWhere.employeeId = scope.employeeId;
  }

  const [grouped, onLeaveToday] = await Promise.all([
    prisma.leaveRequest.groupBy({
      by: ["status"],
      where: baseWhere,
      _count: { _all: true },
    }),
    prisma.leaveRequest.count({
      where: {
        ...baseWhere,
        status: LeaveStatus.APPROVED,
        startDate: { lte: today },
        endDate: { gte: today },
      },
    }),
  ]);

  const byStatus: Partial<Record<LeaveStatus, number>> = {};
  for (const row of grouped) {
    byStatus[row.status] = row._count._all;
  }

  const pending = byStatus.PENDING ?? 0;
  const approved = byStatus.APPROVED ?? 0;
  const rejected = byStatus.REJECTED ?? 0;
  const cancelled = byStatus.CANCELLED ?? 0;

  return {
    totalRequests: pending + approved + rejected + cancelled,
    pending,
    approved,
    rejected,
    cancelled,
    onLeaveToday,
  };
}

export async function findLeaveRequestById(companyId: string, id: string) {
  return prisma.leaveRequest.findFirst({
    where: tenantScope(companyId, { id }),
    include: leaveInclude,
  });
}

export async function findOverlappingLeaves(
  companyId: string,
  employeeId: string,
  startDate: Date,
  endDate: Date,
  excludeId?: string
) {
  const where: Prisma.LeaveRequestWhereInput = {
    companyId,
    employeeId,
    status: { in: ACTIVE_LEAVE_STATUSES },
    ...(excludeId ? { id: { not: excludeId } } : {}),
    startDate: { lte: endDate },
    endDate: { gte: startDate },
  };

  return prisma.leaveRequest.findMany({
    where,
  });
}

export async function createLeaveRequest(data: Prisma.LeaveRequestCreateInput) {
  return prisma.leaveRequest.create({
    data,
    include: leaveInclude,
  });
}

export async function updateLeaveRequest(
  companyId: string,
  id: string,
  data: Prisma.LeaveRequestUpdateInput
) {
  const existing = await findLeaveRequestById(companyId, id);
  if (!existing) return null;
  return prisma.leaveRequest.update({
    where: { id },
    data,
    include: leaveInclude,
  });
}

export async function findLeaveBalance(
  companyId: string,
  employeeId: string,
  year: number
) {
  return prisma.leaveBalance.findFirst({
    where: tenantScope(companyId, { employeeId, year }),
  });
}

export async function upsertLeaveBalance(
  companyId: string,
  employeeId: string,
  year: number,
  data: Partial<{
    casualLeave: number;
    sickLeave: number;
    earnedLeave: number;
    maternityLeave: number;
    paternityLeave: number;
    compOff: number;
  }>
) {
  return prisma.leaveBalance.upsert({
    where: {
      employeeId_year: { employeeId, year },
    },
    create: {
      companyId,
      employeeId,
      year,
      casualLeave: data.casualLeave ?? 12,
      sickLeave: data.sickLeave ?? 8,
      earnedLeave: data.earnedLeave ?? 15,
      maternityLeave: data.maternityLeave ?? 0,
      paternityLeave: data.paternityLeave ?? 0,
      compOff: data.compOff ?? 0,
    },
    update: data,
  });
}

export { dayStart };
