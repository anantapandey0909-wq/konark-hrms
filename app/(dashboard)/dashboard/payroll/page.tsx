import type { Metadata } from "next";
import PayrollDashboard from "@/components/payroll/payroll-dashboard";

export const metadata: Metadata = {
  title: "Payroll Management | Konark HRMS",
  description:
    "Manage payroll records, salary processing, employee compensation, and payroll history.",
};

export default function PayrollPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <PayrollDashboard />
    </main>
  );
}
