"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTable } from "@/components/employee/table/employee-table";
import { EmployeeTableToolbar } from "@/components/employee/table/toolbar";
import type { EmployeeFilters } from "@/components/employee/table/toolbar";
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

  // Strict client-side filtering matching the new multi-tenant keys
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((emp: Employee) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(filters.search.toLowerCase()) ||
        emp.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDept = filters.departmentId === "ALL" || emp.departmentId === filters.departmentId;
      const matchesStatus = filters.status === "ALL" || emp.status === filters.status;
      const matchesType = filters.employmentType === "ALL" || emp.employmentType === filters.employmentType;

      return matchesSearch && matchesDept && matchesStatus && matchesType;
    });
  }, [filters]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full">
      {/* Directory Title and Trigger Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
            <Users className="h-7 w-7 text-primary shrink-0" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor, organize, and administer company personnel records.
          </p>
        </div>
        <Link href="/dashboard/employees/create" passHref>
          <Button className="rounded-xl gap-2 font-medium self-start sm:self-auto h-9">
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </Button>
        </Link>
      </div>

      {/* Interactive Filter Toolbar */}
      <EmployeeTableToolbar
        filters={filters}
        setFilters={setFilters}
        departments={mockDepartments}
      />

      {/* Directory Presentation Grid */}
      <EmployeeTable
        employees={filteredEmployees}
        isLoading={false}
      />
    </div>
  );
}