"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CalendarDays, User, MapPin, BadgePercent, GraduationCap } from "lucide-react";

interface EmploymentData {
  employeeCode: string;
  designation: string;
  department: string;
  joinDate: string;
  workLocation: string;
  managerName: string;
  employmentType: string;
  gradeLevel: string;
}

interface EmploymentInformationProps {
  readonly data: EmploymentData;
}

export function EmploymentInformation({ data }: EmploymentInformationProps) {
  const formattedJoinDate = new Date(data.joinDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-slate-400" />
          Employment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pt-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Employee ID
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.employeeCode}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Date of Joining
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {formattedJoinDate}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Direct Manager
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.managerName}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Work Location
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.workLocation}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            Employment Type
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.employmentType}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <BadgePercent className="h-3.5 w-3.5" />
            Grade & Level
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.gradeLevel}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}