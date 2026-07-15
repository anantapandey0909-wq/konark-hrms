import { mockPayrollSummary, mockPayrollStats } from '@/mock/payroll';
import type { PayrollMetrics } from '@/types/report-metrics';

/**
 * Adapts high-level payroll execution KPIs and summary statistics from the Payroll module 
 * for consumption by the Reports module. This utility leverages precalculated financial 
 * metrics to prevent manual recalculation of raw payroll ledger records.
 * 
 * @returns {PayrollMetrics} Adapted payroll financial and record metrics.
 */
export function getPayrollMetrics(): PayrollMetrics {
  return {
    employeeCount: mockPayrollStats.employeeCount,
    totalPayrollRecords: mockPayrollSummary.totalPayrollRecords,
    paidPayroll: mockPayrollSummary.paidPayroll,
    pendingPayroll: mockPayrollSummary.pendingPayroll,
    approvedPayroll: mockPayrollSummary.approvedPayroll,
    draftPayroll: mockPayrollSummary.draftPayroll,
    totalGrossSalary: mockPayrollStats.totalGrossSalary,
    totalNetSalary: mockPayrollStats.totalNetSalary,
    totalAllowances: mockPayrollStats.totalAllowances,
    totalDeductions: mockPayrollStats.totalDeductions,
    averageNetSalary: mockPayrollStats.averageNetSalary,
  };
}