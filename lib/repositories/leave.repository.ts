import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

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

function dayStart(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

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
  return prisma.leaveRequest.findMany({
    where: {
      companyId,
      employeeId,
      status: { in: ["PENDING", "APPROVED"] },
      ...(excludeId ? { id: { not: excludeId } } : {}),
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
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
