import type { Prisma } from "@prisma/client";
import type {
  PayrollRecord,
  PayrollMonth,
  PayrollStatus,
  SalaryBreakdown,
  PayrollAllowance,
  PayrollDeduction,
  PayrollAttendanceSummary,
  PayrollLeaveSummary,
} from "@/types/payroll";
import type { Department } from "@/types/department";

export type PrismaPayrollRow = {
  id: string;
  payrollNumber: string;
  month: string;
  year: number;
  status: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  employeeCode: string;
  employeeName: string;
  designation: string;
  departmentName: string | null;
  basicSalary: number;
  grossSalary: number;
  netSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  taxableIncome: number;
  allowances: Prisma.JsonValue;
  deductions: Prisma.JsonValue;
  attendanceSummary: Prisma.JsonValue | null;
  leaveSummary: Prisma.JsonValue | null;
  generatedAt: Date | null;
  paidAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  employeeId: string;
  employee?: {
    departmentId: string;
    department?: {
      id: string;
      companyId: string;
      departmentCode: string;
      departmentName: string;
      description: string | null;
      status: string;
      managerId: string | null;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  } | null;
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isoDateTime(d: Date): string {
  return d.toISOString();
}

function parseAllowances(value: Prisma.JsonValue): PayrollAllowance[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id ?? `all-${index}`),
        name: String(row.name ?? "Allowance"),
        amount: Number(row.amount ?? 0),
      };
    })
    .filter((x): x is PayrollAllowance => x !== null);
}

function parseDeductions(value: Prisma.JsonValue): PayrollDeduction[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id ?? `ded-${index}`),
        name: String(row.name ?? "Deduction"),
        amount: Number(row.amount ?? 0),
      };
    })
    .filter((x): x is PayrollDeduction => x !== null);
}

function parseAttendance(
  value: Prisma.JsonValue | null
): PayrollAttendanceSummary {
  const defaults: PayrollAttendanceSummary = {
    workingDays: 0,
    presentDays: 0,
    absentDays: 0,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    overtimeHours: 0,
    lateEntries: 0,
  };
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults;
  const row = value as Record<string, unknown>;
  return {
    workingDays: Number(row.workingDays ?? 0),
    presentDays: Number(row.presentDays ?? 0),
    absentDays: Number(row.absentDays ?? 0),
    paidLeaveDays: Number(row.paidLeaveDays ?? 0),
    unpaidLeaveDays: Number(row.unpaidLeaveDays ?? 0),
    overtimeHours: Number(row.overtimeHours ?? 0),
    lateEntries: Number(row.lateEntries ?? 0),
  };
}

function parseLeave(value: Prisma.JsonValue | null): PayrollLeaveSummary {
  const defaults: PayrollLeaveSummary = {
    totalLeaves: 0,
    paidLeaves: 0,
    unpaidLeaves: 0,
    leaveWithoutPayDays: 0,
  };
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults;
  const row = value as Record<string, unknown>;
  return {
    totalLeaves: Number(row.totalLeaves ?? 0),
    paidLeaves: Number(row.paidLeaves ?? 0),
    unpaidLeaves: Number(row.unpaidLeaves ?? 0),
    leaveWithoutPayDays: Number(row.leaveWithoutPayDays ?? 0),
  };
}

function departmentFromRow(row: PrismaPayrollRow): Department {
  const dept = row.employee?.department;
  if (dept) {
    return {
      id: dept.id,
      tenantId: dept.companyId,
      name: dept.departmentName,
      code: dept.departmentCode,
      description: dept.description,
      managerId: dept.managerId,
      parentDepartmentId: null,
      status: dept.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      sortOrder: 0,
      budget: null,
      createdAt: dept.createdAt.toISOString(),
      updatedAt: dept.updatedAt.toISOString(),
    };
  }
  // Snapshot-only fallback when department relation is missing
  return {
    id: `dept-snapshot-${row.id}`,
    tenantId: row.companyId,
    name: row.departmentName ?? "Unknown",
    code: "N/A",
    description: null,
    managerId: null,
    parentDepartmentId: null,
    status: "ACTIVE",
    sortOrder: 0,
    budget: null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapPayrollToFrontend(row: PrismaPayrollRow): PayrollRecord {
  const allowances = parseAllowances(row.allowances);
  const deductions = parseDeductions(row.deductions);

  const salaryBreakdown: SalaryBreakdown = {
    basicSalary: row.basicSalary,
    grossSalary: row.grossSalary,
    taxableIncome: row.taxableIncome,
    totalAllowances: row.totalAllowances,
    totalDeductions: row.totalDeductions,
    netSalary: row.netSalary,
    allowances,
    deductions,
  };

  return {
    id: row.id,
    payrollNumber: row.payrollNumber,
    employeeId: row.employeeId,
    employeeCode: row.employeeCode,
    employeeName: row.employeeName,
    department: departmentFromRow(row),
    designation: row.designation,
    month: row.month as PayrollMonth,
    year: row.year,
    status: row.status as PayrollStatus,
    payPeriodStart: isoDate(row.payPeriodStart),
    payPeriodEnd: isoDate(row.payPeriodEnd),
    attendanceSummary: parseAttendance(row.attendanceSummary),
    leaveSummary: parseLeave(row.leaveSummary),
    salaryBreakdown,
    generatedAt: row.generatedAt
      ? isoDateTime(row.generatedAt)
      : isoDateTime(row.createdAt),
    paidAt: row.paidAt ? isoDateTime(row.paidAt) : undefined,
    notes: row.notes ?? undefined,
    createdAt: isoDateTime(row.createdAt),
    updatedAt: isoDateTime(row.updatedAt),
  };
}
