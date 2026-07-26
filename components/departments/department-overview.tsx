"use client";

import * as React from "react";
import { ResolvedDepartment } from "@/types/department";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, ShieldCheck, Mail, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DepartmentOverviewProps {
  readonly department: ResolvedDepartment;
}

export function DepartmentOverview({ department }: DepartmentOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</span>
            <p className="text-sm mt-1 text-foreground leading-relaxed">
              {department.description || "No description provided."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department Code</span>
              <div className="text-sm font-mono mt-1 font-semibold">{department.code}</div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
              <div className="mt-1">
                {department.status === "ACTIVE" ? (
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parent Division</span>
              <div className="text-sm mt-1">
                {department.parentDepartment ? (
                  <Badge variant="outline">{department.parentDepartment.name}</Badge>
                ) : (
                  <span className="text-muted-foreground text-xs">None (Root level)</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort Order</span>
              <div className="text-sm mt-1 font-medium">{department.sortOrder}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manager Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {department.manager ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-16 w-16 shadow-sm">
                <AvatarImage src={department.manager.avatarUrl ?? undefined} />
                <AvatarFallback className="text-lg">
                  {department.manager.firstName[0]}
                  {department.manager.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-base">
                  {department.manager.firstName} {department.manager.lastName}
                </h3>
                <p className="text-xs text-muted-foreground">{department.manager.designation}</p>
              </div>
              <div className="w-full space-y-2 pt-2 text-left border-t text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{department.manager.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>ID: {department.manager.employeeId}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Joined: {department.manager.joiningDate}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground text-sm">
              <Building className="h-10 w-10 mb-2 text-muted-foreground/40" />
              <span>No manager assigned.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}