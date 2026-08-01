"use client";

import {
  Users,
  UserCheck,
  CalendarClock,
  UserPlus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    title: "Total Employees",
    value: "248",
    description: "Across all departments",
    icon: Users,
  },
  {
    title: "Active Employees",
    value: "236",
    description: "Currently working",
    icon: UserCheck,
  },
  {
    title: "Pending Leave Requests",
    value: "12",
    description: "Require approval",
    icon: CalendarClock,
  },
  {
    title: "New Joinees",
    value: "8",
    description: "Joined this month",
    icon: UserPlus,
  },
];

export function HRKPICards() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card
            key={metric.title}
            className="border-zinc-200 transition-shadow hover:shadow-md dark:border-zinc-800"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {metric.title}
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                  {metric.value}
                </h2>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {metric.description}
                </p>
              </div>

              <div className="rounded-xl bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

export default HRKPICards;