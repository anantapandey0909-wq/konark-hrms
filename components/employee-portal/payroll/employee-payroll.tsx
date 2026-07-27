"use client";

import * as React from "react";
import { useState } from "react";
import { PayrollOverview } from "./payroll-overview";
import { SalaryBreakdown } from "./salary-breakdown";
import { DeductionsSummary } from "./deductions-summary";
import { PayrollHistory } from "./payroll-history";
import { PayslipPreview } from "./payslip-preview";
import { PaymentTimeline } from "./payment-timeline";
import { PayrollActions } from "./payroll-actions";

// Comprehensive structural dataset matching enterprise components (October 2025 cycle)
const mockPayrollData = {
  activePayCycle: {
    month: "October",
    year: 2025,
    grossSalary: 85000,
    deductions: 7200,
    netSalary: 77800,
  },
  earnings: [
    { id: "e1", name: "Basic Salary", amount: 42500, category: "Core" },
    { id: "e2", name: "House Rent Allowance (HRA)", amount: 17000, category: "Allowances" },
    { id: "e3", name: "Special Allowance", amount: 15300, category: "Allowances" },
    { id: "e4", name: "Leave Travel Allowance (LTA)", amount: 5100, category: "Reimbursements" },
    { id: "e5", name: "Performance Bonus", amount: 5100, category: "Variable" },
  ],
  deductions: [
    { id: "d1", name: "Provident Fund (PF)", amount: 5100, isStatutory: true },
    { id: "d2", name: "Professional Tax (PT)", amount: 200, isStatutory: true },
    { id: "d3", name: "Income Tax (TDS)", amount: 1900, isStatutory: true },
  ],
  timeline: {
    payPeriod: "Oct 01, 2025 - Oct 31, 2025",
    disbursementDate: "Oct 31, 2025",
    steps: [
      { id: "p1", title: "Payroll Computed", description: "System generation finalized", status: "COMPLETED" as const, date: "2025-10-25" },
      { id: "p2", title: "Compliance Signed", description: "Verification completed", status: "COMPLETED" as const, date: "2025-10-27" },
      { id: "p3", title: "Bank Clearance", description: "Direct deposit completed", status: "COMPLETED" as const, date: "2025-10-31" },
    ],
  },
  history: [
    { id: "ph-1", period: "September 2025", gross: 85000, deductions: 7200, net: 77800, status: "PAID" as const, paidAt: "2025-09-30" },
    { id: "ph-2", period: "August 2025", gross: 85000, deductions: 7200, net: 77800, status: "PAID" as const, paidAt: "2025-08-31" },
    { id: "ph-3", period: "July 2025", gross: 85000, deductions: 6800, net: 78200, status: "PAID" as const, paidAt: "2025-07-31" },
    { id: "ph-4", period: "June 2025", gross: 80000, deductions: 6400, net: 73600, status: "PAID" as const, paidAt: "2025-06-30" },
  ],
};

export function EmployeePayroll() {
  const [selectedCycle, setSelectedCycle] = useState(mockPayrollData.activePayCycle);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Compensation Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track earnings configurations, dynamic deduction indexes, tax computations, and historical payslips.
        </p>
      </div>

      {/* Main Overview Segment */}
      <PayrollOverview data={selectedCycle} />

      {/* Grid Alignment Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Columns: Breakdown Components & Pay History */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SalaryBreakdown earnings={mockPayrollData.earnings} />
            <DeductionsSummary deductions={mockPayrollData.deductions} />
          </div>
          <PayrollHistory history={mockPayrollData.history} />
        </div>

        {/* Right Column: Timeline, Preview & Configuration Actions */}
        <div className="space-y-6 lg:col-span-1">
          <PaymentTimeline timeline={mockPayrollData.timeline} />
          <PayslipPreview month={selectedCycle.month} year={selectedCycle.year} />
          <PayrollActions />
        </div>
      </div>
    </div>
  );
}