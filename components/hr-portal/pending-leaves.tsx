"use client";

import { CalendarClock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PendingLeave {
  readonly id: string;
  readonly employee: string;
  readonly department: string;
  readonly leaveType: string;
  readonly duration: string;
}

const pendingLeaves: readonly PendingLeave[] = [
  {
    id: "LV-1001",
    employee: "Harshita Sharma",
    department: "Human Resources",
    leaveType: "Casual Leave",
    duration: "2 Days",
  },
  {
    id: "LV-1002",
    employee: "Rahul Verma",
    department: "Engineering",
    leaveType: "Sick Leave",
    duration: "1 Day",
  },
  {
    id: "LV-1003",
    employee: "Aman Singh",
    department: "Sales",
    leaveType: "Earned Leave",
    duration: "5 Days",
  },
  {
    id: "LV-1004",
    employee: "Priya Joshi",
    department: "Finance",
    leaveType: "Maternity Leave",
    duration: "90 Days",
  },
];

export function PendingLeaves() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Leave Requests</CardTitle>

          <CardDescription>
            Employee leave applications awaiting review.
          </CardDescription>
        </div>

        <CalendarClock className="h-5 w-5 text-primary" />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {pendingLeaves.map((leave) => (
            <div
              key={leave.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="space-y-1">
                <h4 className="font-medium">
                  {leave.employee}
                </h4>

                <p className="text-sm text-muted-foreground">
                  {leave.department}
                </p>

                <div className="flex gap-2 pt-1">
                  <Badge variant="secondary">
                    {leave.leaveType}
                  </Badge>

                  <Badge variant="outline">
                    {leave.duration}
                  </Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
              >
                Review
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PendingLeaves;