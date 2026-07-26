"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  CreditCard, 
  Search, 
  Filter, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Building,
  Calendar,
  ChevronDown,
  Eye
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { mockPayrollRecords } from "@/mock/payroll";
import { mockDepartments } from "@/mock/department";
import { getPayrollStats, getPayrollSummary } from "@/lib/reports/payroll-metrics";
import type { PayrollRecord, PayrollStatus, PayrollMonth } from "@/types/payroll";

export const PayrollDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);

  const stats = getPayrollStats(mockPayrollRecords);
  const summary = getPayrollSummary(mockPayrollRecords);

  const filteredRecords = mockPayrollRecords.filter((record) => {
    const matchesSearch = 
      record.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      record.payrollNumber.toLowerCase().includes(search.toLowerCase()) ||
      record.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      record.designation.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDeptId === "ALL" || record.department.id === selectedDeptId;
    const matchesStatus = selectedStatus === "ALL" || record.status === selectedStatus;
    const matchesMonth = selectedMonth === "ALL" || record.month === selectedMonth;

    return matchesSearch && matchesDept && matchesStatus && matchesMonth;
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadgeClass = (status: PayrollStatus) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "APPROVED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "DRAFT":
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payroll Hub</h1>
          <p className="text-muted-foreground text-sm">
            Execute operational payroll, track expenditures, and verify structured compliance records.
          </p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Outlay (Gross)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalGrossSalary)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Allocated across {stats.employeeCount} active headcount
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Released (Paid)
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.paidPayroll)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed transactional payroll transfers
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Approvals
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.pendingPayroll)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting transactional sign-off
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Draft Reserve
              </CardTitle>
              <CreditCard className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.draftPayroll)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated draft allocation totals
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Payroll Records</CardTitle>
              <CardDescription>Search, filter, and audit individual payroll statements.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search payroll number, employee..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Divisions</SelectItem>
                      {mockDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Months</SelectItem>
                      <SelectItem value="JANUARY">January</SelectItem>
                      <SelectItem value="FEBRUARY">February</SelectItem>
                      <SelectItem value="MARCH">March</SelectItem>
                      <SelectItem value="APRIL">April</SelectItem>
                      <SelectItem value="MAY">May</SelectItem>
                      <SelectItem value="JUNE">June</SelectItem>
                      <SelectItem value="JULY">July</SelectItem>
                      <SelectItem value="AUGUST">August</SelectItem>
                      <SelectItem value="SEPTEMBER">September</SelectItem>
                      <SelectItem value="OCTOBER">October</SelectItem>
                      <SelectItem value="NOVEMBER">November</SelectItem>
                      <SelectItem value="DECEMBER">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <div className="min-w-full divide-y divide-border">
                  <div className="bg-muted/40 grid grid-cols-6 p-3 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    <div className="col-span-2">Employee / ID</div>
                    <div>Pay Period</div>
                    <div>Gross Salary</div>
                    <div>Net Salary</div>
                    <div className="text-right">Action</div>
                  </div>
                  <div className="divide-y divide-border">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="grid grid-cols-6 p-3 items-center text-xs hover:bg-muted/20 transition-colors">
                        <div className="col-span-2 space-y-0.5">
                          <p className="font-semibold text-foreground text-sm">{record.employeeName}</p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            {record.employeeCode} • {record.designation}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">{record.month} {record.year}</p>
                          <p className="text-[10px] text-muted-foreground">{record.payrollNumber}</p>
                        </div>
                        <div className="font-semibold text-foreground">
                          {formatCurrency(record.salaryBreakdown.grossSalary)}
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(record.status)}`}>
                            {record.status}
                          </span>
                          <p className="font-bold text-foreground text-sm mt-0.5">
                            {formatCurrency(record.salaryBreakdown.netSalary)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setSelectedRecord(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredRecords.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        No active payroll statements found matching the filter query.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedRecord && (
          <div className="w-full lg:w-96 space-y-6">
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="pb-3 border-b flex flex-row justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
                    Audit Statement
                  </CardTitle>
                  <CardDescription className="text-xs">{selectedRecord.payrollNumber}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedRecord(null)}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  Close
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">{selectedRecord.employeeName}</h4>
                  <p className="text-muted-foreground">{selectedRecord.designation} • {selectedRecord.department.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Period Start</span>
                    <span className="font-semibold text-foreground">{selectedRecord.payPeriodStart}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Period End</span>
                    <span className="font-semibold text-foreground">{selectedRecord.payPeriodEnd}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold border-b pb-1 text-muted-foreground text-[10px] uppercase tracking-wider">
                    Attendance Summary
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/20 p-2 rounded">
                      <span className="text-muted-foreground text-[10px] block">Working Days</span>
                      <span className="font-bold text-foreground text-sm">{selectedRecord.attendanceSummary.workingDays}</span>
                    </div>
                    <div className="bg-muted/20 p-2 rounded">
                      <span className="text-muted-foreground text-[10px] block">Present</span>
                      <span className="font-bold text-emerald-500 text-sm">{selectedRecord.attendanceSummary.presentDays}</span>
                    </div>
                    <div className="bg-muted/20 p-2 rounded">
                      <span className="text-muted-foreground text-[10px] block">Absent</span>
                      <span className="font-bold text-rose-500 text-sm">{selectedRecord.attendanceSummary.absentDays}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold border-b pb-1 text-muted-foreground text-[10px] uppercase tracking-wider">
                    Salary Breakdown
                  </h5>
                  <div className="space-y-1.5 font-medium">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Salary</span>
                      <span className="text-foreground">{formatCurrency(selectedRecord.salaryBreakdown.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Allowances</span>
                      <span className="text-emerald-500">+{formatCurrency(selectedRecord.salaryBreakdown.totalAllowances)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Total Deductions</span>
                      <span className="text-rose-500">-{formatCurrency(selectedRecord.salaryBreakdown.totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1 text-foreground">
                      <span>Net Salary</span>
                      <span>{formatCurrency(selectedRecord.salaryBreakdown.netSalary)}</span>
                    </div>
                  </div>
                </div>

                {selectedRecord.notes && (
                  <div className="text-[10px] text-muted-foreground bg-muted/20 p-2 rounded border border-border">
                    <span className="font-bold block text-foreground mb-0.5">Note:</span>
                    {selectedRecord.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};