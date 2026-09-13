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

const DEFAULT_PAGE_SIZE = 10;

interface LeaveDashboardProps {
  readonly initialRequests: LeaveRequest[];
  readonly initialTotal: number;
  readonly initialPage: number;
  readonly initialPageSize: number;
  readonly initialStats: LeaveStatsSummary;
}

export default function LeaveDashboard({
  initialRequests,
  initialTotal,
  initialPage,
  initialPageSize,
  initialStats,
}: LeaveDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<LeaveStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<LeaveType | "ALL">("ALL");
  const [departmentFilter, setDepartmentFilter] =
    useState<string | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize || DEFAULT_PAGE_SIZE);
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(initialRequests);
  const [totalItems, setTotalItems] = useState(initialTotal);
  const [isPending, startTransition] = useTransition();

  /** KPI cards stay on full unfiltered stats (existing semantics). */
  const stats = initialStats;

  /**
   * Server-side status + leaveType + page only.
   * Search and department remain UI-only on the current page (Part 4B).
   */
  const reloadFromServer = useCallback(
    (
      status: LeaveStatus | "ALL",
      leaveType: LeaveType | "ALL",
      page: number
    ) => {
      startTransition(async () => {
        try {
          const result = await fetchLeaveRequests({
            status: status === "ALL" ? undefined : status,
            leaveType: leaveType === "ALL" ? undefined : leaveType,
            page,
            pageSize,
          });
          setLeaveRequests(result.items);
          setTotalItems(result.total);
          setCurrentPage(result.page);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to reload leave requests."
          );
        }
      });
    },
    [pageSize]
  );

  const normalizedQuery = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery]
  );

  /**
   * Department options from the current page only (not org-wide).
   * Full department filter is deferred to Phase 12.9D Part 4B.
   */
  const departments = useMemo(() => {
    return [
      ...new Set(
        leaveRequests
          .map((leave) => leave.department)
          .filter((department): department is string => Boolean(department))
      ),
    ].sort();
  }, [leaveRequests]);

  /**
   * Search / department apply only to the current server page.
   * They do not imply filtering the full tenant dataset.
   */
  const displayedLeaveRequests = useMemo(() => {
    return leaveRequests.filter((leave) => {
      const matchesSearch =
        !normalizedQuery ||
        leave.employeeName.toLowerCase().includes(normalizedQuery) ||
        leave.employeeCode.toLowerCase().includes(normalizedQuery) ||
        leave.reason.toLowerCase().includes(normalizedQuery);

      const matchesDepartment =
        departmentFilter === "ALL" || leave.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [leaveRequests, normalizedQuery, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    reloadFromServer(statusFilter, typeFilter, next);
  };

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
        }}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
          reloadFromServer(value, typeFilter, 1);
        }}
        typeFilter={typeFilter}
        onTypeChange={(value) => {
          setTypeFilter(value);
          setCurrentPage(1);
          reloadFromServer(statusFilter, value, 1);
        }}
        departmentFilter={departmentFilter}
        onDepartmentChange={(value) => {
          setDepartmentFilter(value);
        }}
        departments={departments}
      />

      <LeaveTable
        records={displayedLeaveRequests}
        currentPage={activePage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
        isLoading={isPending}
      />
    </div>
  );
}
