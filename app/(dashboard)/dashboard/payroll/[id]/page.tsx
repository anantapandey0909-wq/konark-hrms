import type { Metadata } from "next";
import { getPayrollById } from "@/mock/payroll";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PayrollStatusBadge } from "@/components/payroll/payroll-status-badge";
import { cn } from "@/lib/utils";
import {
  formatPayrollCurrency,
  formatPayrollDate,
  formatPayrollMonth,
} from "@/lib/payroll";
import { ChevronLeft, Edit, FileText,  Clock, BarChart3, Receipt, Clipboard } from "lucide-react";

export const metadata: Metadata = {
  title: "Payroll Details | Konark HRMS",
  description: "View payroll details for an employee.",
};

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

function DetailRow({ label, value, className = "" }: DetailRowProps) {
  return (
    <div
  className={cn(
    "flex justify-between py-1.5 border-b last:border-b-0 text-sm",
    className
  )}
>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function PayrollDetailsPage({ params }: PageProps) {
  const payroll = getPayrollById(params.id);

  if (!payroll) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      {/* Navigation & Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/dashboard/payroll" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back to Payroll
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {payroll.payrollNumber}
            </h1>
            <PayrollStatusBadge status={payroll.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            Employee: <span className="font-semibold text-foreground">{payroll.employeeName}</span> &middot; {payroll.designation} ({payroll.department})
          </p>
          {payroll.generatedAt && (
            <p className="text-xs text-muted-foreground">
              Generated: {formatPayrollDate(payroll.generatedAt)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/payroll/${payroll.id}/edit`} className="flex items-center gap-1.5">
              <Edit className="h-4 w-4" aria-hidden="true" />
              Edit Payroll
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left & Middle: Basic Information, Salary Breakdown, and Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Payroll Number</span>
                <span className="font-medium text-foreground">{payroll.payrollNumber}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Employee Code</span>
                <span className="font-medium text-foreground">{payroll.employeeCode}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Department</span>
                <span className="font-medium text-foreground">{payroll.department}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Designation</span>
                <span className="font-medium text-foreground">{payroll.designation}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Month</span>
                <span className="font-medium text-foreground">{formatPayrollMonth(payroll.month)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Year</span>
                <span className="font-medium text-foreground">{payroll.year}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Generated Date</span>
                <span className="font-medium text-foreground">
                  {payroll.generatedAt ? formatPayrollDate(payroll.generatedAt) : "N/A"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Paid Date</span>
                <span className="font-medium text-foreground">
                  {payroll.paidAt ? formatPayrollDate(payroll.paidAt) : "Unpaid"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 4. Salary Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                Salary Breakdown
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-muted/30 p-3 rounded-lg space-y-0.5">
                  <span className="text-muted-foreground text-xs block">Basic Salary</span>
                  <span className="text-base font-semibold">
                    {formatPayrollCurrency(payroll.salaryBreakdown.basicSalary)}
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg space-y-0.5">
                  <span className="text-muted-foreground text-xs block">Gross Salary</span>
                  <span className="text-base font-semibold">
                    {formatPayrollCurrency(payroll.salaryBreakdown.grossSalary)}
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg space-y-0.5">
                  <span className="text-muted-foreground text-xs block">Taxable Income</span>
                  <span className="text-base font-semibold">
                    {formatPayrollCurrency(payroll.salaryBreakdown.taxableIncome)}
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg space-y-0.5">
                  <span className="text-muted-foreground text-xs block">Total Allowances</span>
                  <span className="text-base font-semibold text-emerald-600">
                    + {formatPayrollCurrency(payroll.salaryBreakdown.totalAllowances)}
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg space-y-0.5">
                  <span className="text-muted-foreground text-xs block">Total Deductions</span>
                  <span className="text-base font-semibold text-destructive">
                    - {formatPayrollCurrency(payroll.salaryBreakdown.totalDeductions)}
                  </span>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 space-y-0.5">
                  <span className="text-primary text-xs font-semibold block">Net Salary</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPayrollCurrency(payroll.salaryBreakdown.netSalary)}
                  </span>
                </div>
              </div>

              {/* Allowances List */}
              {payroll.salaryBreakdown.allowances && payroll.salaryBreakdown.allowances.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-semibold text-foreground">Allowances</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {payroll.salaryBreakdown.allowances.map((allowance) => (
                      <div key={allowance.id} className="flex justify-between p-2 rounded-md bg-muted/20 border">
                        <span className="text-muted-foreground">
  {allowance.name || "Allowance"}
</span>
                        <span className="font-semibold text-emerald-600">
                          + {formatPayrollCurrency(allowance.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deductions List */}
              {payroll.salaryBreakdown.deductions && payroll.salaryBreakdown.deductions.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-semibold text-foreground">Deductions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {payroll.salaryBreakdown.deductions.map((deduction) => (
                      <div key={deduction.id} className="flex justify-between p-2 rounded-md bg-muted/20 border">
                    <span className="text-muted-foreground">
  {deduction.name}
</span>
                        <span className="font-semibold text-destructive">
                          - {formatPayrollCurrency(deduction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                Notes
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {payroll.notes ? payroll.notes : "No notes available."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Attendance & Leave Summary */}
        <div className="space-y-6">
          {/* 2. Attendance Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                Attendance Summary
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-1">
              <DetailRow label="Working Days" value={payroll.attendanceSummary.workingDays} />
              <DetailRow label="Present Days" value={payroll.attendanceSummary.presentDays} />
              <DetailRow label="Absent Days" value={payroll.attendanceSummary.absentDays} className="[&>span:last-child]:text-destructive" />
              <DetailRow label="Paid Leave Days" value={payroll.attendanceSummary.paidLeaveDays} />
              <DetailRow label="Unpaid Leave Days" value={payroll.attendanceSummary.unpaidLeaveDays} className="[&>span:last-child]:text-destructive" />
              <DetailRow label="Overtime Hours" value={`${payroll.attendanceSummary.overtimeHours} hrs`} />
              <DetailRow label="Late Entries" value={payroll.attendanceSummary.lateEntries} className="[&>span:last-child]:text-amber-600" />
            </CardContent>
          </Card>

          {/* 3. Leave Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                Leave Summary
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-1">
              <DetailRow label="Total Leaves" value={payroll.leaveSummary.totalLeaves} />
              <DetailRow label="Paid Leaves" value={payroll.leaveSummary.paidLeaves} />
              <DetailRow label="Unpaid Leaves" value={payroll.leaveSummary.unpaidLeaves} />
              <DetailRow label="Leave Without Pay Days" value={payroll.leaveSummary.leaveWithoutPayDays} className="[&>span:last-child]:text-destructive" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}