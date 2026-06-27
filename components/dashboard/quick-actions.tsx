import {
  UserPlus,
  Calendar,
  FileText,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const actions = [
  {
    label: "Add Employee",
    icon: UserPlus,
    iconBg: "bg-amber-500",
    primary: true,
  },
  {
    label: "Mark Attendance",
    icon: Calendar,
    iconBg: "bg-blue-500",
    primary: false,
  },
  {
    label: "Generate Payroll",
    icon: FileText,
    iconBg: "bg-emerald-500",
    primary: false,
  },
  {
    label: "System Settings",
    icon: Settings2,
    iconBg: "bg-zinc-600",
    primary: false,
  },
];

export function QuickActions() {
  return (
    <Card className="h-[360px] border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-lg font-semibold">
          Quick Actions
        </CardTitle>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Frequently used HR operations.
        </p>
      </CardHeader>

      <CardContent className="grid flex-1 grid-cols-2 gap-4 p-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              variant={action.primary ? "default" : "outline"}
              className={`h-32 flex-col gap-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                action.primary
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : ""
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  action.primary
                    ? "bg-white/20"
                    : `${action.iconBg} text-white`
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <span className="text-sm font-semibold">
                {action.label}
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}