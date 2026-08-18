"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmployeeTable } from "@/components/employee/table/employee-table";
import {
  EmployeeTableToolbar,
  type EmployeeFilters,
} from "@/components/employee/table/toolbar";

import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";

import { fetchEmployees } from "@/lib/data/employees";
import { fetchDepartments } from "@/lib/data/departments";

export default function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    departmentId: "ALL",
    status: "ALL",
    employmentType: "ALL",
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const [emps, depts] = await Promise.all([
          fetchEmployees({
            search: filters.search || undefined,
            departmentId: filters.departmentId,
            status: filters.status,
            employmentType: filters.employmentType,
          }),
          fetchDepartments(),
        ]);
        if (!cancelled) {
          setEmployees(emps);
          setDepartments(depts);
        }
      } catch {
        if (!cancelled) {
          setEmployees([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const filteredEmployees = useMemo(() => employees, [employees]);

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="inline-flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Users className="h-7 w-7 shrink-0 text-primary" />
            <span>Employee Directory</span>
          </h1>

          <p className="text-sm text-muted-foreground">
            Monitor, organize, and administer company personnel records.
          </p>
        </div>

        <Button
          asChild
          className="h-9 self-start rounded-xl gap-2 font-medium sm:self-auto"
        >
          <Link href="/dashboard/employees/new">
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </Link>
        </Button>
      </div>

      <EmployeeTableToolbar
        filters={filters}
        setFilters={setFilters}
        departments={departments}
      />

      <EmployeeTable employees={filteredEmployees} isLoading={isLoading} />
    </div>
  );
}
