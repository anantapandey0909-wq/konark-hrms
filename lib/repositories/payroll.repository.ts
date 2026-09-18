import type { Prisma, PayrollMonth, PayrollStatus } from "@prisma/client";
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

export type PayrollListPagination = {
  /** 1-based page (clamped by service). */
  page: number;
  pageSize: number;
};

function buildPayrollWhere(
  companyId: string,
  filters: PayrollListFilters
): Prisma.PayrollWhereInput {
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

  return where;
}

const payrollOrderBy: Prisma.PayrollOrderByWithRelationInput[] = [
  { year: "desc" },
  { month: "desc" },
  { createdAt: "desc" },
  { id: "desc" },
];

/**
 * Paginated tenant payroll list.
 * Same WHERE for findMany + count. Offset pagination only.
 */
export async function findPayrollsByCompany(
  companyId: string,
  filters: PayrollListFilters = {},
  pagination: PayrollListPagination = { page: 1, pageSize: 10 }
) {
  const where = buildPayrollWhere(companyId, filters);
  const skip = (pagination.page - 1) * pagination.pageSize;
  const take = pagination.pageSize;

  const [items, total] = await Promise.all([
    prisma.payroll.findMany({
      where,
      include: payrollInclude,
      orderBy: payrollOrderBy,
      skip,
      take,
    }),
    prisma.payroll.count({ where }),
  ]);

  return { items, total };
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

/**
 * Batch lookup for import conflict detection (avoids N+1).
 * companyId is trusted server context only.
 */
export async function findPayrollsByEmployeePeriods(
  companyId: string,
  employeeIds: string[],
  months: PayrollMonth[],
  years: number[]
) {
  if (employeeIds.length === 0) return [];

  const uniqueEmployees = Array.from(new Set(employeeIds.filter(Boolean)));
  const uniqueMonths = Array.from(new Set(months.filter(Boolean)));
  const uniqueYears = Array.from(new Set(years.filter((y) => Number.isFinite(y))));

  if (
    uniqueEmployees.length === 0 ||
    uniqueMonths.length === 0 ||
    uniqueYears.length === 0
  ) {
    return [];
  }

  const where: Prisma.PayrollWhereInput = {
    companyId,
    employeeId: { in: uniqueEmployees },
    month: { in: uniqueMonths },
    year: { in: uniqueYears },
  };

  return prisma.payroll.findMany({
    where,
    select: {
      id: true,
      employeeId: true,
      month: true,
      year: true,
    },
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

/**
 * Financial aggregates for Payroll Hub summary cards.
 * Excludes CANCELLED so expense/processed totals match active liability semantics.
 * companyId is trusted server context only.
 */
export async function aggregatePayrollAmounts(companyId: string) {
  return prisma.payroll.aggregate({
    where: {
      companyId,
      status: { not: "CANCELLED" as PayrollStatus },
    },
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
