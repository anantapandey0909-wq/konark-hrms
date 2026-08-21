import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tenantScope } from "@/lib/db/prisma-with-tenant";

const payrollInclude = {
  employee: {
    include: {
      department: true,
    },
  },
} as const;

export type PayrollListFilters = {
  search?: string;
  status?: string;
  month?: string;
  year?: number;
  departmentId?: string;
  employeeId?: string;
};

export async function findPayrollsByCompany(
  companyId: string,
  filters: PayrollListFilters = {}
) {
  const where: Prisma.PayrollWhereInput = tenantScope(companyId, {});

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status as Prisma.EnumPayrollStatusFilter["equals"];
  }
  if (filters.month && filters.month !== "ALL") {
    where.month = filters.month as Prisma.EnumPayrollMonthFilter["equals"];
  }
  if (typeof filters.year === "number") {
    where.year = filters.year;
  }
  if (filters.employeeId) {
    where.employeeId = filters.employeeId;
  }
  if (filters.departmentId && filters.departmentId !== "ALL") {
    where.employee = { departmentId: filters.departmentId };
  }
  if (filters.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { employeeName: { contains: q, mode: "insensitive" } },
      { employeeCode: { contains: q, mode: "insensitive" } },
      { payrollNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  return prisma.payroll.findMany({
    where,
    include: payrollInclude,
    orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
  });
}

export async function findPayrollById(companyId: string, id: string) {
  return prisma.payroll.findFirst({
    where: tenantScope(companyId, { id }),
    include: payrollInclude,
  });
}

export async function findPayrollByEmployeePeriod(
  companyId: string,
  employeeId: string,
  month: string,
  year: number
) {
  return prisma.payroll.findFirst({
    where: tenantScope(companyId, {
      employeeId,
      month: month as Prisma.EnumPayrollMonthFilter["equals"],
      year,
    }),
  });
}

export async function createPayroll(data: Prisma.PayrollCreateInput) {
  return prisma.payroll.create({
    data,
    include: payrollInclude,
  });
}

export async function updatePayroll(
  companyId: string,
  id: string,
  data: Prisma.PayrollUpdateInput
) {
  const existing = await findPayrollById(companyId, id);
  if (!existing) return null;
  return prisma.payroll.update({
    where: { id },
    data,
    include: payrollInclude,
  });
}

export async function countPayrollsByStatus(companyId: string) {
  const groups = await prisma.payroll.groupBy({
    by: ["status"],
    where: { companyId },
    _count: { _all: true },
  });
  return groups;
}

export async function aggregatePayrollAmounts(companyId: string) {
  return prisma.payroll.aggregate({
    where: { companyId },
    _sum: {
      grossSalary: true,
      netSalary: true,
      totalAllowances: true,
      totalDeductions: true,
    },
    _avg: {
      netSalary: true,
    },
    _count: { _all: true },
  });
}
