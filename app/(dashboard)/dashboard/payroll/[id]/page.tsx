"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  ArrowLeft, 
  Printer, 
  Building2, 
  Calendar, 
  User, 
  Briefcase, 
  CreditCard,
  DollarSign,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { mockPayrollRecords } from "@/mock/payroll";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PayrollDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const record = mockPayrollRecords.find((r) => r.id === id);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">Payroll Record Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The requested payroll statement could not be resolved in our system.
        </p>
        <Button onClick={() => router.push("/dashboard/payroll")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payroll
        </Button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <Button onClick={() => router.push("/dashboard/payroll")} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payroll Hub
        </Button>
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" /> Print Payslip
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <Card className="border shadow-lg overflow-hidden">
          <div className="bg-primary/5 p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Official Statement
              </span>
              <h2 className="text-2xl font-bold text-foreground">Payslip of Account</h2>
              <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> For period of {record.month} {record.year}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Payslip Number</p>
              <p className="text-lg font-bold text-primary">{record.payrollNumber}</p>
              <p className="text-[10px] text-muted-foreground">Generated at: {record.generatedAt.split("T")[0]}</p>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h3 className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">
                  Employee Specifications
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{record.employeeName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Employee ID: {record.employeeCode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{record.designation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{record.department.name} ({record.department.code})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">
                  Payment Parameters
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Start Period</span>
                    <span className="font-medium text-foreground">{record.payPeriodStart}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">End Period</span>
                    <span className="font-medium text-foreground">{record.payPeriodEnd}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-bold text-emerald-500">{record.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-500 text-[10px] uppercase tracking-wider border-b pb-1.5 flex justify-between">
                  <span>Earnings &amp; Allowances</span>
                  <span>Amount</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Basic Salary</span>
                    <span>{formatCurrency(record.salaryBreakdown.basicSalary)}</span>
                  </div>
                  {record.salaryBreakdown.allowances.map((allowance) => (
                    <div key={allowance.id} className="flex justify-between text-muted-foreground">
                      <span>{allowance.name}</span>
                      <span>{formatCurrency(allowance.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t pt-2 text-emerald-500">
                    <span>Total Allowances</span>
                    <span>{formatCurrency(record.salaryBreakdown.totalAllowances + record.salaryBreakdown.basicSalary)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-rose-500 text-[10px] uppercase tracking-wider border-b pb-1.5 flex justify-between">
                  <span>Deductions &amp; Taxes</span>
                  <span>Amount</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {record.salaryBreakdown.deductions.map((deduction) => (
                    <div key={deduction.id} className="flex justify-between text-muted-foreground">
                      <span>{deduction.name}</span>
                      <span>{formatCurrency(deduction.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t pt-2 text-rose-500">
                    <span>Total Deductions</span>
                    <span>{formatCurrency(record.salaryBreakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-0.5 text-center md:text-left">
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                  Net Compensation
                </p>
                <p className="text-xs text-muted-foreground">
                  The net transactional amount transferred directly to the designated bank account.
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-3xl font-extrabold text-primary">
                  {formatCurrency(record.salaryBreakdown.netSalary)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-center border-t pt-6">
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider mb-0.5">Working Days</span>
                <span className="font-bold text-foreground text-sm">{record.attendanceSummary.workingDays}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider mb-0.5">Present</span>
                <span className="font-bold text-emerald-500 text-sm">{record.attendanceSummary.presentDays}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider mb-0.5">Absent</span>
                <span className="font-bold text-rose-500 text-sm">{record.attendanceSummary.absentDays}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider mb-0.5">Overtime Hours</span>
                <span className="font-bold text-foreground text-sm">{record.attendanceSummary.overtimeHours} hrs</span>
              </div>
            </div>

            {record.notes && (
              <div className="text-[10px] text-muted-foreground bg-muted/20 p-3 rounded-lg border">
                <span className="font-bold block text-foreground mb-0.5 uppercase tracking-wider">Authorized Notes</span>
                {record.notes}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}