import {
  Users,
  UserCheck,
  CalendarDays,
  CreditCard,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminDashboardData } from "@/lib/services/admin-dashboard.service";

type Props = {
  data: AdminDashboardData;
};

function payrollStatusLabel(data: AdminDashboardData): {
  value: string;
  description: string;
} {
  if (!data.includePayrollMetrics || !data.payrollStatusCounts) {
    return { value: "—", description: "not available" };
  }
  const c = data.payrollStatusCounts;
  const open = c.draft + c.pending;
  if (open > 0) {
    return {
      value: String(open),
      description: `draft/pending of ${c.draft + c.pending + c.approved + c.paid + c.cancelled} total`,
    };
  }
  if (c.approved > 0) {
    return {
      value: String(c.approved),
      description: "approved records",
    };
  }
  if (c.paid > 0) {
    return {
      value: String(c.paid),
      description: "paid records",
    };
  }
  return {
    value: "0",
    description: "no payroll records",
  };
}

export function KPICards({ data }: Props) {
  const payroll = payrollStatusLabel(data);

  const stats = [
    {
      title: "TOTAL EMPLOYEES",
      value: data.totalEmployees.toLocaleString(),
      description: "in organization",
      icon: Users,
    },
    {
      title: "PRESENT TODAY",
      value: `${data.presentTodayPercent}%`,
      description: `${data.presentTodayCount} of ${data.activeEmployeeCount} active`,
      icon: UserCheck,
    },
    {
      title: "LEAVE REQUESTS",
      value: String(data.pendingLeaveRequests),
      description: "pending approvals",
      icon: CalendarDays,
    },
    {
      title: "PAYROLL",
      value: payroll.value,
      description: payroll.description,
      icon: CreditCard,
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="h-28 border border-zinc-200/70 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <CardContent className="flex h-full items-center justify-between p-5">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                    {item.value}
                  </h2>
                </div>

                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
