"use client";

import * as React from "react";
import { ResolvedDepartment } from "@/types/department";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Eye, Edit } from "lucide-react";

interface DepartmentTableProps {
  readonly departments: readonly ResolvedDepartment[];
}

export function DepartmentTable({ departments }: DepartmentTableProps) {
  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Parent Division</TableHead>
            <TableHead>Headcount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-sm">
                No departments match the criteria.
              </TableCell>
            </TableRow>
          ) : (
            departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-mono text-xs font-semibold">{dept.code}</TableCell>
                <TableCell className="font-medium text-sm">
                  <Link href={`/dashboard/departments/${dept.id}`} className="hover:underline text-primary">
                    {dept.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {dept.manager ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={dept.manager.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-[10px]">
                          {dept.manager.firstName[0]}
                          {dept.manager.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-semibold">
                          {dept.manager.firstName} {dept.manager.lastName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{dept.manager.designation}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {dept.parentDepartment ? (
                    <Badge variant="outline">{dept.parentDepartment.name}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm font-semibold">{dept.employeeCount}</TableCell>
                <TableCell>
                  {dept.status === "ACTIVE" ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/departments/${dept.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/departments/${dept.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}