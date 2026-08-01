"use client";

import Link from "next/link";
import {
  UserPlus,
  CalendarClock,
  Users,
  Building2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickAction {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: React.ElementType;
}

const quickActions: readonly QuickAction[] = [
  {
    title: "Add Employee",
    description: "Register a new employee",
    href: "/dashboard/employees/create",
    icon: UserPlus,
  },
  {
    title: "Leave Requests",
    description: "Review pending approvals",
    href: "/dashboard/leave",
    icon: CalendarClock,
  },
  {
    title: "Employees",
    description: "Manage employee records",
    href: "/dashboard/employees",
    icon: Users,
  },
  {
    title: "Departments",
    description: "Manage departments",
    href: "/dashboard/departments",
    icon: Building2,
  },
];

export function HRQuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.title}
              asChild
              variant="outline"
              className="h-auto w-full justify-start rounded-xl p-4"
            >
              <Link href={action.href}>
                <div className="mr-4 rounded-lg bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {action.title}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default HRQuickActions;