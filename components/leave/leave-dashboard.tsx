"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import LeaveStats from "@/components/leave/leave-stats";
import LeaveFilters from "@/components/leave/leave-filters";
import LeaveTable from "@/components/leave/leave-table";
import { fetchLeaveRequests } from "@/lib/data/leave";
import { fetchDepartments } from "@/lib/data/departments";

import type {
  LeaveStatus,
  LeaveType,
  LeaveStatsSummary,
  LeaveRequest,
} from "@/types/leave";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

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
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize || DEFAULT_PAGE_SIZE);
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(initialRequests);
  const [totalItems, setTotalItems] = useState(initialTotal);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stats = initialStats;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const depts = await fetchDepartments();
        if (!cancelled) {
          setDepartments(
            depts.map((d) => ({ id: d.id, name: d.name })).sort((a, b) =>
              a.name.localeCompare(b.name)
            )
          );
        }
      } catch {
        if (!cancelled) setDepartments([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reloadFromServer = useCallback(
    (args: {
      status: LeaveStatus | "ALL";
      leaveType: LeaveType | "ALL";
      departmentId: string;
      search: string;
      page: number;
    }) => {
      startTransition(async () => {
        try {
          const result = await fetchLeaveRequests({
            status: args.status === "ALL" ? undefined : args.status,
            leaveType: args.leaveType === "ALL" ? undefined : args.leaveType,
            departmentId:
              args.departmentId === "ALL" ? undefined : args.departmentId,
            search: args.search.trim() || undefined,
            page: args.page,
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

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    reloadFromServer({
      status: statusFilter,
      leaveType: typeFilter,
      departmentId: departmentFilter,
      search: searchQuery,
      page: next,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      reloadFromServer({
        status: statusFilter,
        leaveType: typeFilter,
        departmentId: departmentFilter,
        search: value,
        page: 1,
      });
    }, SEARCH_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

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
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
          reloadFromServer({
            status: value,
            leaveType: typeFilter,
            departmentId: departmentFilter,
            search: searchQuery,
            page: 1,
          });
        }}
        typeFilter={typeFilter}
        onTypeChange={(value) => {
          setTypeFilter(value);
          setCurrentPage(1);
          reloadFromServer({
            status: statusFilter,
            leaveType: value,
            departmentId: departmentFilter,
            search: searchQuery,
            page: 1,
          });
        }}
        departmentFilter={departmentFilter}
        onDepartmentChange={(value) => {
          setDepartmentFilter(value);
          setCurrentPage(1);
          reloadFromServer({
            status: statusFilter,
            leaveType: typeFilter,
            departmentId: value,
            search: searchQuery,
            page: 1,
          });
        }}
        departments={departments}
      />

      <LeaveTable
        records={leaveRequests}
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
