import * as React from "react";
import type { Metadata } from "next";
import { EmployeeLeave } from "@/components/employee-portal/leave/employee-leave";

export const metadata: Metadata = {
  title: "My Leave | Konark HRMS",
  description: "Employee self-service leave management.",
};

export default function EmployeeLeavePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeLeave />
    </div>
  );
}