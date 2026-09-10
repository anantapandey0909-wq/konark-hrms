"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import LeaveStats from "@/components/leave/leave-stats";
import LeaveFilters from "@/components/leave/leave-filters";
import LeaveTable from "@/components/leave/leave-table";
import { fetchLeaveRequests } from "@/lib/data/leave";

import type {
  LeaveStatus,
  LeaveType,
  LeaveStatsSummary,
  LeaveRequest,
} from "@/types/leave";

const ITEMS_PER_PAGE = 10;

interface LeaveDashboardProps {
  readonly initialRequests: LeaveRequest[];
  readonly initialStats: LeaveStatsSummary;
}

export default function LeaveDashboard({
  initialRequests,
  initialStats,
}: LeaveDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<LeaveStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<LeaveType | "ALL">("ALL");
  const [departmentFilter, setDepartmentFilter] =
    useState<string | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(initialRequests);
  const [isPending, startTransition] = useTransition();

  /** KPI cards stay on full unfiltered stats (existing semantics). */
  const stats = initialStats;

  /**
   * Server-side status + leaveType only (repo already supports these).
   * Search and department name stay client-side (no server search/name API).
   */
  const reloadFromServer = useCallback(
    (status: LeaveStatus | "ALL", leaveType: LeaveType | "ALL") => {
      startTransition(async () => {
        try {
          const rows = await fetchLeaveRequests({
            status: status === "ALL" ? undefined : status,
            leaveType: leaveType === "ALL" ? undefined : leaveType,
          });
          setLeaveRequests(rows);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to reload leave requests."
          );
        }
      });
    },
    []
  );

  const normalizedQuery = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery]
  );

  const departments = useMemo(() => {
    return [
      ...new Set(
        leaveRequests
          .map((leave) => leave.department)
          .filter((department): department is string => Boolean(department))
      ),
    ].sort();
  }, [leaveRequests]);

  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.filter((leave) => {
      const matchesSearch =
        !normalizedQuery ||
        leave.employeeName.toLowerCase().includes(normalizedQuery) ||
        leave.employeeCode.toLowerCase().includes(normalizedQuery) ||
        leave.reason.toLowerCase().includes(normalizedQuery);

      // status + type already applied server-side; keep defensive client match
      const matchesStatus =
        statusFilter === "ALL" || leave.status === statusFilter;

      const matchesLeaveType =
        typeFilter === "ALL" || leave.leaveType === typeFilter;

      const matchesDepartment =
        departmentFilter === "ALL" || leave.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLeaveType &&
        matchesDepartment
      );
    });
  }, [
    leaveRequests,
    normalizedQuery,
    statusFilter,
    typeFilter,
    departmentFilter,
  ]);

  const totalItems = filteredLeaveRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedLeaveRequests = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredLeaveRequests.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredLeaveRequests, activePage]);

  const resetPagination = () => setCurrentPage(1);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee leave requests, approvals, balances, and leave
            history.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/leave/new">
            <Plus className="mr-2 h-4 w-4" />
            Apply Leave
          </Link>
        </Button>
      </div>

      <LeaveStats
        total={stats.totalRequests}
        totalRequests={stats.totalRequests}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
        cancelled={stats.cancelled}
        onLeaveToday={stats.onLeaveToday}
      />

      <LeaveFilters
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          resetPagination();
        }}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value);
          resetPagination();
          reloadFromServer(value, typeFilter);
        }}
        typeFilter={typeFilter}
        onTypeChange={(value) => {
          setTypeFilter(value);
          resetPagination();
          reloadFromServer(statusFilter, value);
        }}
        departmentFilter={departmentFilter}
        onDepartmentChange={(value) => {
          setDepartmentFilter(value);
          resetPagination();
        }}
        departments={departments}
      />

      <LeaveTable
        records={paginatedLeaveRequests}
        currentPage={activePage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        isLoading={isPending}
      />
    </div>
  );
}
