"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Mail,
  UserCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecentEmployee {
  readonly id: string;
  readonly name: string;
  readonly designation: string;
  readonly department: string;
  readonly email: string;
  readonly joiningDate: string;
}

const recentEmployees: readonly RecentEmployee[] = [
  {
    id: "EMP-101",
    name: "Harshita Sharma",
    designation: "HR Executive",
    department: "Human Resources",
    email: "harshita@konarkhrms.com",
    joiningDate: "02 Aug 2026",
  },
  {
    id: "EMP-102",
    name: "Rahul Verma",
    designation: "Frontend Developer",
    department: "Engineering",
    email: "rahul@konarkhrms.com",
    joiningDate: "30 Jul 2026",
  },
  {
    id: "EMP-103",
    name: "Priya Joshi",
    designation: "UI Designer",
    department: "Design",
    email: "priya@konarkhrms.com",
    joiningDate: "28 Jul 2026",
  },
  {
    id: "EMP-104",
    name: "Aman Singh",
    designation: "QA Engineer",
    department: "Quality Assurance",
    email: "aman@konarkhrms.com",
    joiningDate: "25 Jul 2026",
  },
];

export function RecentEmployees() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Employees</CardTitle>

          <CardDescription>
            Newly onboarded employees across the organization.
          </CardDescription>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
        >
          <Link href="/dashboard/employees">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentEmployees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  <UserCircle2 className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h4 className="font-medium">
                  {employee.name}
                </h4>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {employee.department}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {employee.email}
                </div>
              </div>
            </div>

            <div className="text-right space-y-2">
              <Badge variant="secondary">
                {employee.designation}
              </Badge>

              <p className="text-xs text-muted-foreground">
                Joined {employee.joiningDate}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default RecentEmployees;