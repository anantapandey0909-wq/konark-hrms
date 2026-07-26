"use client";

import * as React from "react";
import { mockEmployees } from "@/mock/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Briefcase, Phone, Hash } from "lucide-react";

interface DepartmentMembersProps {
  readonly departmentId: string;
}

export function DepartmentMembers({ departmentId }: DepartmentMembersProps) {
  const members = React.useMemo(() => {
    return mockEmployees.filter((emp) => emp.departmentId === departmentId);
  }, [departmentId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Department Members</CardTitle>
        <Badge variant="outline" className="font-semibold text-xs">
          {members.length} {members.length === 1 ? "Employee" : "Employees"}
        </Badge>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No employees assigned to this department.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col p-4 rounded-lg border bg-card hover:shadow-sm transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {member.firstName} {member.lastName}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">{member.designation}</p>
                  </div>
                </div>
                <div className="border-t pt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3 shrink-0" />
                    <span>ID: {member.employeeId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3 w-3 shrink-0" />
                    <span className="capitalize">{member.employmentType.toLowerCase()}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}