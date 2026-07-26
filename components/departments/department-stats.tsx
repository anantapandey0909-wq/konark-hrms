"use client";

import * as React from "react";
import { DepartmentSummary } from "@/types/department";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CheckCircle, XCircle } from "lucide-react";

interface DepartmentStatsProps {
  readonly summary: DepartmentSummary;
}

export function DepartmentStats({ summary }: DepartmentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalDepartments}</div>
          <p className="text-xs text-muted-foreground">Organizational divisions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Divisions</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{summary.activeDepartments}</div>
          <p className="text-xs text-muted-foreground">Operational divisions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Divisions</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">{summary.inactiveDepartments}</div>
          <p className="text-xs text-muted-foreground">Archived configurations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Active directory directory size</p>
        </CardContent>
      </Card>
    </div>
  );
}