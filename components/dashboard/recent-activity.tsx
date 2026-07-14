import {
  CheckCircle2,
  UserPlus,
  Wallet,
  CalendarClock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    title: "Payroll processed",
    description: "Finance completed July payroll.",
    icon: Wallet,
    time: "2 min ago",
  },
  {
    title: "Employee added",
    description: "Sarah Chen joined Engineering.",
    icon: UserPlus,
    time: "15 min ago",
  },
  {
    title: "Attendance updated",
    description: "Today's attendance synced.",
    icon: CalendarClock,
    time: "30 min ago",
  },
  {
    title: "Leave approved",
    description: "Annual leave approved.",
    icon: CheckCircle2,
    time: "1 hour ago",
  },
];

export function RecentActivity() {
  return (
    <Card className="border border-zinc-200/70 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-start gap-3"
            >
              <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-900">
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  {activity.title}
                </p>

                <p className="text-sm text-zinc-500">
                  {activity.description}
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
