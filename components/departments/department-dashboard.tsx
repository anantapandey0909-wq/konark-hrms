"use client";

import * as React from "react";
import { ResolvedDepartment, DepartmentSummary } from "@/types/department";
import { DepartmentStats } from "./department-stats";
import { DepartmentTable } from "./department-table";
import { DepartmentFilters } from "./department-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DepartmentDashboardProps {
  readonly initialDepartments: readonly ResolvedDepartment[];
  readonly summary: DepartmentSummary;
}

export function DepartmentDashboard({ initialDepartments, summary }: DepartmentDashboardProps) {
  const [departments] = React.useState<readonly ResolvedDepartment[]>(initialDepartments);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string>("ALL");

  const filteredDepartments = React.useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || dept.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [departments, search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground text-sm">
            Manage organizational divisions, hierarchical relationships, and assigned managers.
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/dashboard/departments/new">
              <Plus className="mr-2 h-4 w-4" /> Create Department
            </Link>
          </Button>
        </div>
      </div>

      <DepartmentStats summary={summary} />

      <div className="space-y-4">
        <DepartmentFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
        <DepartmentTable departments={filteredDepartments} />
      </div>
    </div>
  );
}