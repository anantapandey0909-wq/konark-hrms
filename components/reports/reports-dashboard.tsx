"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Users,
  CreditCard,
  TrendingUp,
  Briefcase,
  UserCheck,
  Calendar,
  IndianRupee,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ReportsDashboardData } from "@/lib/services/reports.service";
import { formatINR } from "@/lib/payroll/formatters";

interface ReportsDashboardProps {
  readonly data: ReportsDashboardData;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ data }) => {
  const empStats = data.employeeStats;
  const showPayroll = data.includePayrollMetrics;
  const payrollStats = data.payrollStats;
  const payrollSummary = data.payrollSummary;
  const recentHires = data.recentHires;
  const deptDistribution = data.departmentDistribution;
  const statusDistribution = data.statusDistribution;
  const typeDistribution = data.employmentTypeDistribution;
  const deptPayrollMetrics = data.departmentPayrollMetrics;
  const payrollTrend = data.monthlyPayrollTrend;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const headcountDenominator = Math.max(empStats.totalEmployees, 1);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Real-time organizational insights, employee demographics
          {showPayroll ? ", and strategic payroll summaries" : ""}.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Headcount Strategy
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {empStats.activeCount} active • {empStats.onLeaveCount} on leave
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {showPayroll && payrollStats && payrollSummary && (
          <>
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Payroll Cost
                  </CardTitle>
                  <IndianRupee className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatINR(payrollStats.totalGrossSalary)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All non-cancelled payroll periods
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Net Salary
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatINR(payrollStats.averageNetSalary)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average across payroll records
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Payroll Statements
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-violet-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {payrollSummary.totalPayrollRecords}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All non-cancelled payroll records
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>

      {showPayroll && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Monthly Payroll Trend</CardTitle>
              <CardDescription>
                Aggregate financial commitment across fiscal months.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {payrollTrend.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No payroll trend data.
                </p>
              )}
              {payrollTrend.map((trend) => {
                const maxGross =
                  Math.max(...payrollTrend.map((t) => t.totalGross), 1) || 1;
                const percentage = (trend.totalGross / maxGross) * 100;
                return (
                  <div key={`${trend.year}-${trend.month}`} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {trend.month} {trend.year}
                      </span>
                      <span className="text-muted-foreground font-semibold">
                        {formatINR(trend.totalGross)}{" "}
                        <span className="text-xs">
                          ({trend.recordCount} records)
                        </span>
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2 bg-muted [&>div]:bg-emerald-500"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Department Allocation</CardTitle>
              <CardDescription>
                Gross payroll by business unit across all non-cancelled periods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {deptPayrollMetrics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No department payroll data.
                </p>
              )}
              {deptPayrollMetrics.map((dept) => {
                const headCount =
                  deptDistribution.find((d) => d.departmentId === dept.departmentId)
                    ?.count ?? 0;
                return (
                  <div
                    key={dept.departmentId}
                    className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/25"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-foreground">
                        {dept.departmentName}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {headCount} FTEs
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Gross Allocation:</span>
                      <span className="font-semibold text-foreground">
                        {formatINR(dept.totalGross)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-500" />
              Employment Types
            </CardTitle>
            <CardDescription>
              Contractual distribution across resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeDistribution.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No employment type data.
              </p>
            )}
            {typeDistribution.map((item) => {
              const pct = (item.count / headcountDenominator) * 100;
              return (
                <div key={item.employmentType} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.employmentType.replace("_", " ")}</span>
                    <span className="text-muted-foreground">
                      {item.count} employees ({Math.round(pct)}%)
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal-500" />
              Resource Status
            </CardTitle>
            <CardDescription>
              Active tracking of workforce availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusDistribution.length === 0 && (
              <p className="text-sm text-muted-foreground">No status data.</p>
            )}
            {statusDistribution.map((item) => {
              const pct = (item.count / headcountDenominator) * 100;
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.status.replace("_", " ")}</span>
                    <span className="text-muted-foreground">
                      {item.count} employees ({Math.round(pct)}%)
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className="h-2 bg-muted [&>div]:bg-teal-500"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              Recent Onboardings
            </CardTitle>
            <CardDescription>
              Newly joined personnel across departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentHires.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent hires.</p>
            )}
            {recentHires.map((hire) => (
              <div
                key={hire.id}
                className="flex items-start gap-3 text-xs pb-3 border-b last:border-0 last:pb-0"
              >
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-foreground">{hire.name}</p>
                  <p className="text-muted-foreground">
                    {hire.designation} • {hire.workLocation}
                  </p>
                </div>
                <div className="text-right text-muted-foreground">
                  <p className="font-medium">{hire.joiningDate}</p>
                  <p className="text-[10px] text-primary/70">{hire.employeeId}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
