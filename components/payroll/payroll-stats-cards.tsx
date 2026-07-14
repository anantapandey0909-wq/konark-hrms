"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  CircleCheck,
  Clock3,
  FileText,
  Wallet,
  BadgeIndianRupee,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPayrollCurrency } from "@/lib/payroll";
import type { PayrollSummary, PayrollStats } from "@/types/payroll";
import { PayrollSummaryCard } from "./payroll-summary-card";

export interface PayrollStatsCardsProps {
  summary: PayrollSummary;
  stats: PayrollStats;
  loading?: boolean;
  className?: string;
}

type PayrollStatCard = Readonly<{
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}>;

export function PayrollStatsCards({
  summary,
  stats,
  loading = false,
  className,
}: PayrollStatsCardsProps) {
  const cards = useMemo<ReadonlyArray<PayrollStatCard>>(
    () => [
      {
        title: "Total Employees",
        value: summary.totalEmployees,
        description: "Employees processed",
        icon: Users,
      },
      {
        title: "Paid Payroll",
        value: summary.paidPayroll,
        description: "Successfully paid",
        icon: CircleCheck,
      },
      {
        title: "Pending Payroll",
        value: summary.pendingPayroll,
        description: "Awaiting approval",
        icon: Clock3,
      },
      {
        title: "Draft Payroll",
        value: summary.draftPayroll,
        description: "Draft payroll records",
        icon: FileText,
      },
      {
        title: "Total Gross Salary",
        value: formatPayrollCurrency(stats.totalGrossSalary),
        description: "Gross salary processed",
        icon: Wallet,
      },
      {
        title: "Total Net Salary",
        value: formatPayrollCurrency(stats.totalNetSalary),
        description: "Net salary payable",
        icon: BadgeIndianRupee,
      },
      {
        title: "Total Deductions",
        value: formatPayrollCurrency(stats.totalDeductions),
        description: "Payroll deductions",
        icon: TrendingDown,
      },
      {
        title: "Total Allowances",
        value: formatPayrollCurrency(stats.totalAllowances),
        description: "Payroll allowances",
        icon: TrendingUp,
      },
    ],
    [summary, stats]
  );

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {cards.map((card) => (
        <PayrollSummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          loading={loading}
        />
      ))}
    </div>
  );
}

PayrollStatsCards.displayName = "PayrollStatsCards";
