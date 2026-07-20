"use client";

import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
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

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  primary?: boolean;
}

const actions: QuickAction[] = [
  {
    label: "Add Employee",
    description: "Register a new employee",
    href: "/dashboard/employees/new",
    icon: UserPlus,
    iconBg: "bg-amber-500",
    primary: true,
  },
  {
    label: "Mark Attendance",
    description: "Manage today's attendance",
    href: "/dashboard/attendance",
    icon: Calendar,
    iconBg: "bg-blue-500",
  },
  {
    label: "Generate Payroll",
    description: "Process employee salaries",
    href: "/dashboard/payroll",
    icon: FileText,
    iconBg: "bg-emerald-500",
  },
  {
    label: "System Settings",
    description: "Configure organization",
    href: "/dashboard/settings",
    icon: Settings2,
    iconBg: "bg-zinc-600",
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <Card className="border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-lg font-semibold">
          Quick Actions
        </CardTitle>

        <p className="mt-1 text-sm text-muted-foreground">
          Frequently used HR operations.
        </p>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-5 p-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              onClick={() => router.push(action.href)}
              className={`group h-44 flex-col items-center justify-center rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                action.primary
                  ? "border-amber-300 bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-background"
              }`}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                  action.primary
                    ? "bg-white/20"
                    : `${action.iconBg} text-white`
                }`}
              >
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="text-base font-semibold">
                {action.label}
              </h3>

              <p
                className={`mt-2 max-w-[160px] text-center text-xs leading-relaxed ${
                  action.primary
                    ? "text-white/85"
                    : "text-muted-foreground"
                }`}
              >
                {action.description}
              </p>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}