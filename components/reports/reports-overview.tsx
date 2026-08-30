"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  BarChart3,
  Users,
  TrendingUp,
  Briefcase,
  Layers,
  MapPin,
  UserPlus,
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

interface ReportsOverviewProps {
  readonly data: ReportsDashboardData;
}

export const ReportsOverview: React.FC<ReportsOverviewProps> = ({ data }) => {
  const empStats = data.employeeStats;
  const showPayroll = data.includePayrollMetrics;
  const payrollStats = data.payrollStats;
  const payrollSummary = data.payrollSummary;
  const recentHires = data.recentHires.slice(0, 3);
  const headcountDenominator = Math.max(empStats.totalEmployees, 1);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 110,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Executive Summary</h2>
        <p className="text-sm text-muted-foreground">
          High-level operational overview of active headcount
          {showPayroll ? ", payroll trends," : ""} and organizational structure.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Headcount
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-semibold">
                  {empStats.activeCount}
                </span>{" "}
                active personnel
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {showPayroll && payrollStats && payrollSummary && (
          <>
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-card to-muted/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Active Payroll
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatINR(payrollStats.totalGrossSalary)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatINR(payrollSummary.paidPayroll)} processed and paid
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-card to-muted/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Average Compensation
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatINR(payrollStats.averageNetSalary)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Regular net baseline average salary
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-card to-muted/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Statements Drafted
                  </CardTitle>
                  <Layers className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {payrollSummary.totalPayrollRecords}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Individual operational records generated
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Contractual Breakdown
            </CardTitle>
            <CardDescription>
              Employment allocation within the resource pool.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3 text-primary" /> Full-Time
                </span>
                <span className="text-muted-foreground font-semibold">
                  {empStats.fullTimeCount} FTEs
                </span>
              </div>
              <Progress
                value={(empStats.fullTimeCount / headcountDenominator) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-amber-500" /> Contract
                </span>
                <span className="text-muted-foreground font-semibold">
                  {empStats.contractCount} Contractors
                </span>
              </div>
              <Progress
                value={(empStats.contractCount / headcountDenominator) * 100}
                className="h-2 bg-muted [&>div]:bg-amber-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-emerald-500" /> Part-Time
                </span>
                <span className="text-muted-foreground font-semibold">
                  {empStats.partTimeCount} Part-Time
                </span>
              </div>
              <Progress
                value={(empStats.partTimeCount / headcountDenominator) * 100}
                className="h-2 bg-muted [&>div]:bg-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-blue-500" /> Intern
                </span>
                <span className="text-muted-foreground font-semibold">
                  {empStats.internCount} Interns
                </span>
              </div>
              <Progress
                value={(empStats.internCount / headcountDenominator) * 100}
                className="h-2 bg-muted [&>div]:bg-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Latest Onboardings
            </CardTitle>
            <CardDescription>
              Recently registered personnel joining the workforce.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentHires.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent hires.</p>
            )}
            {recentHires.map((hire) => (
              <div
                key={hire.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/10 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">{hire.name}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {hire.designation}
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-medium text-muted-foreground">
                    {hire.joiningDate}
                  </p>
                  <p className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5" /> {hire.workLocation}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
