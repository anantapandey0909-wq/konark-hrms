import {
  Users,
  UserCheck,
  CalendarDays,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "TOTAL EMPLOYEES",
    value: "1,284",
    change: "+12%",
    description: "vs last month",
    positive: true,
    icon: Users,
  },
  {
    title: "PRESENT TODAY",
    value: "92%",
    change: "+2.4%",
    description: "attendance rate",
    positive: true,
    icon: UserCheck,
  },
  {
    title: "LEAVE REQUESTS",
    value: "18",
    change: "-4",
    description: "pending approvals",
    positive: false,
    icon: CalendarDays,
  },
  {
    title: "PAYROLL",
    value: "Processing",
    change: "3 Days",
    description: "until payroll run",
    positive: true,
    icon: CreditCard,
  },
];

export function KPICards() {
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
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`mt-3 flex items-center gap-1 text-xs font-medium ${
                    item.positive
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                >
                  {item.positive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}

                  <span>{item.change}</span>

                  <span className="text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </span>
                </div>
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