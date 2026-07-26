import type { PayrollRecord, PayrollStats, PayrollSummary } from "@/types/payroll";

export const getPayrollStats = (records: PayrollRecord[]): PayrollStats => {
  const employeeCount = new Set(records.map((r) => r.employeeId)).size;
  let totalGrossSalary = 0;
  let totalNetSalary = 0;
  let totalAllowances = 0;
  let totalDeductions = 0;

  records.forEach((record) => {
    totalGrossSalary += record.salaryBreakdown.grossSalary;
    totalNetSalary += record.salaryBreakdown.netSalary;
    totalAllowances += record.salaryBreakdown.totalAllowances;
    totalDeductions += record.salaryBreakdown.totalDeductions;
  });

  const averageNetSalary = records.length > 0 ? Math.round(totalNetSalary / records.length) : 0;

  return {
    employeeCount,
    totalGrossSalary,
    totalNetSalary,
    totalAllowances,
    totalDeductions,
    averageNetSalary,
  };
};

export const getPayrollSummary = (records: PayrollRecord[]): PayrollSummary => {
  const totalPayrollRecords = records.length;
  const totalEmployees = new Set(records.map((r) => r.employeeId)).size;

  let paidPayroll = 0;
  let pendingPayroll = 0;
  let approvedPayroll = 0;
  let draftPayroll = 0;

  records.forEach((record) => {
    const net = record.salaryBreakdown.netSalary;
    if (record.status === "PAID") {
      paidPayroll += net;
    } else if (record.status === "PENDING") {
      pendingPayroll += net;
    } else if (record.status === "APPROVED") {
      approvedPayroll += net;
    } else if (record.status === "DRAFT") {
      draftPayroll += net;
    }
  });

  return {
    totalPayrollRecords,
    totalEmployees,
    paidPayroll,
    pendingPayroll,
    approvedPayroll,
    draftPayroll,
  };
};

export interface DepartmentPayrollMetric {
  departmentId: string;
  departmentName: string;
  totalGross: number;
  totalNet: number;
  recordCount: number;
}

export const getDepartmentPayrollMetrics = (records: PayrollRecord[]): DepartmentPayrollMetric[] => {
  const metricsMap = new Map<string, DepartmentPayrollMetric>();

  records.forEach((record) => {
    const deptId = record.department.id;
    const existing = metricsMap.get(deptId);

    if (existing) {
      existing.totalGross += record.salaryBreakdown.grossSalary;
      existing.totalNet += record.salaryBreakdown.netSalary;
      existing.recordCount += 1;
    } else {
      metricsMap.set(deptId, {
        departmentId: deptId,
        departmentName: record.department.name,
        totalGross: record.salaryBreakdown.grossSalary,
        totalNet: record.salaryBreakdown.netSalary,
        recordCount: 1,
      });
    }
  });

  return Array.from(metricsMap.values());
};

export interface MonthlyPayrollTrend {
  month: string;
  year: number;
  totalGross: number;
  totalNet: number;
  recordCount: number;
}

export const getMonthlyPayrollTrend = (records: PayrollRecord[]): MonthlyPayrollTrend[] => {
  const trendMap = new Map<string, MonthlyPayrollTrend>();

  records.forEach((record) => {
    const key = `${record.year}-${record.month}`;
    const existing = trendMap.get(key);

    if (existing) {
      existing.totalGross += record.salaryBreakdown.grossSalary;
      existing.totalNet += record.salaryBreakdown.netSalary;
      existing.recordCount += 1;
    } else {
      trendMap.set(key, {
        month: record.month,
        year: record.year,
        totalGross: record.salaryBreakdown.grossSalary,
        totalNet: record.salaryBreakdown.netSalary,
        recordCount: 1,
      });
    }
  });

  return Array.from(trendMap.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    const months = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });
};