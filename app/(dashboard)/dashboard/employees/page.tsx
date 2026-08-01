"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmployeeTable } from "@/components/employee/table/employee-table";
import {
  EmployeeTableToolbar,
  type EmployeeFilters,
} from "@/components/employee/table/toolbar";

import type { Employee } from "@/types/employee";

import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";

export default function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    departmentId: "ALL",
    status: "ALL",
    employmentType: "ALL",
  });

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((emp: Employee) => {
      const fullName =
        `${emp.firstName} ${emp.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(filters.search.toLowerCase()) ||
        emp.email
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        emp.employeeId
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesDept =
        filters.departmentId === "ALL" ||
        emp.departmentId === filters.departmentId;

      const matchesStatus =
        filters.status === "ALL" ||
        emp.status === filters.status;

      const matchesType =
        filters.employmentType === "ALL" ||
        emp.employmentType ===
          filters.employmentType;

      return (
        matchesSearch &&
        matchesDept &&
        matchesStatus &&
        matchesType
      );
    });
  }, [filters]);

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-8">
      {/* Page Header */}
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
          <Link href="/dashboard/employees/create">
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <EmployeeTableToolbar
        filters={filters}
        setFilters={setFilters}
        departments={mockDepartments}
      />

      {/* Employee Table */}
      <EmployeeTable
        employees={filteredEmployees}
        isLoading={false}
      />
    </div>
  );
}