"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import type {
  DepartmentStatusFilter,
  DepartmentSummary,
  ResolvedDepartment,
} from "@/types/department";

import { Button } from "@/components/ui/button";
import { DepartmentFilters } from "./department-filters";
import { DepartmentStats } from "./department-stats";
import { DepartmentTable } from "./department-table";

interface DepartmentDashboardProps {
  readonly initialDepartments: readonly ResolvedDepartment[];
  readonly summary: DepartmentSummary;
}

export function DepartmentDashboard({
  initialDepartments,
  summary,
}: DepartmentDashboardProps) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] =
    React.useState<DepartmentStatusFilter>("ALL");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredDepartments = React.useMemo(() => {
    return initialDepartments.filter((department) => {
      const matchesSearch =
        department.name.toLowerCase().includes(normalizedSearch) ||
        department.code.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        status === "ALL" || department.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [initialDepartments, normalizedSearch, status]);

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Departments
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage organizational divisions, hierarchical relationships,
            and assigned managers.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/departments/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Department
          </Link>
        </Button>
      </div>

      <DepartmentStats summary={summary} />

      <section className="space-y-4">
        <DepartmentFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />

        <DepartmentTable departments={filteredDepartments} />
      </section>
    </main>
  );
}