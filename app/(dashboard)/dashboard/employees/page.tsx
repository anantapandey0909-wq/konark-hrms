"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { Plus, Users, Layers } from "lucide-react";

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
import {
  clearBulkSelectionIds,
  getBulkSelectionServerSnapshot,
  getBulkSelectionSnapshot,
  parseBulkSelectionSnapshot,
  subscribeBulkSelection,
  writeBulkSelectionIds,
} from "@/lib/client/bulk-selection-store";

const PAGE_SIZE = 5;

export default function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    departmentId: "ALL",
    status: "ALL",
    employmentType: "ALL",
  });
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectionSnapshot = useSyncExternalStore(
    subscribeBulkSelection,
    getBulkSelectionSnapshot,
    getBulkSelectionServerSnapshot
  );
  const selectedIds = useMemo(
    () => parseBulkSelectionSnapshot(selectionSnapshot),
    [selectionSnapshot]
  );

  const handleSelectionChange = useCallback((ids: string[]) => {
    writeBulkSelectionIds(ids);
  }, []);

  const handleFiltersChange = useCallback(
    (next: React.SetStateAction<EmployeeFilters>) => {
      setFilters(next);
      setPage(1);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const [list, depts] = await Promise.all([
          fetchEmployees({
            search: filters.search || undefined,
            departmentId: filters.departmentId,
            status: filters.status,
            employmentType: filters.employmentType,
            page,
            pageSize: PAGE_SIZE,
          }),
          fetchDepartments(),
        ]);
        if (!cancelled) {
          setEmployees(list.items);
          setTotal(list.total);
          setDepartments(depts);
        }
      } catch {
        if (!cancelled) {
          setEmployees([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters, page]);

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
            {selectedIds.length > 0 && (
              <span className="ml-1 font-medium text-indigo-600 dark:text-indigo-400">
                ({selectedIds.length} selected)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          {selectedIds.length > 0 && (
            <>
              <Button
                asChild
                variant="outline"
                className="h-9 rounded-xl gap-2 font-medium"
              >
                <Link href="/dashboard/data-management/bulk-operations">
                  <Layers className="h-4 w-4" />
                  <span>Bulk ops ({selectedIds.length})</span>
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded-xl text-xs"
                onClick={() => clearBulkSelectionIds()}
              >
                Clear selection
              </Button>
            </>
          )}
          <Button asChild className="h-9 rounded-xl gap-2 font-medium">
            <Link href="/dashboard/employees/new">
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </Link>
          </Button>
        </div>
      </div>

      <EmployeeTableToolbar
        filters={filters}
        setFilters={handleFiltersChange}
        departments={departments}
      />

      <EmployeeTable
        employees={employees}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
