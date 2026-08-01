import * as React from "react";
import type { Metadata } from "next";
import { EmployeePayroll } from "@/components/employee-portal/payroll/employee-payroll";

export const metadata: Metadata = {
  title: "My Payroll | Konark HRMS",
  description: "Employee self-service payroll and payslip portal.",
};

export default function EmployeePayrollPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeePayroll />
    </div>
  );
}