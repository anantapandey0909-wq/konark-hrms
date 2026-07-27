"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeProfile } from "@/types/employee-portal";
import { CalendarDays, IdCard, UserSquare2, Mail } from "lucide-react";

interface EmployeeSummaryProps {
  readonly profile: EmployeeProfile;
}

export function EmployeeSummary({ profile }: EmployeeSummaryProps) {
  const formattedJoinDate = new Date(profile.joinDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
          Employment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-3">
          <IdCard className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Employee ID</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {profile.employeeCode}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Official Email</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 break-all">
              {profile.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Date of Joining</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {formattedJoinDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <UserSquare2 className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Direct Manager</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {profile.managerName}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}