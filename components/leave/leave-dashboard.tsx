"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import LeaveStats from "@/components/leave/leave-stats";
import LeaveFilters from "@/components/leave/leave-filters";
import LeaveTable from "@/components/leave/leave-table";

import { mockLeaveRequests } from "@/lib/mock-data";

import {
  LeaveStatus,
  LeaveType,
  LeaveStatsSummary,
} from "@/types/leave";

const ITEMS_PER_PAGE = 10;

export default function LeaveDashboard() {
  /* -------------------------------------------------------------------------- */
  /*                                  State                                     */
  /* -------------------------------------------------------------------------- */

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<LeaveStatus | "ALL">("ALL");

  const [typeFilter, setTypeFilter] =
    useState<LeaveType | "ALL">("ALL");

  const [departmentFilter, setDepartmentFilter] =
    useState<string | "ALL">("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Frontend only.
   * This will later come from API state.
   */
  const isLoading = false;

  /**
   * Normalize the search query once.
   * Prevents repeated string operations during filtering.
   */
  const normalizedQuery = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery]
  );
    /* -------------------------------------------------------------------------- */
  /*                             Department Options                             */
  /* -------------------------------------------------------------------------- */

  const departments = useMemo(() => {
    return [
      ...new Set(
        mockLeaveRequests
          .map((leave) => leave.department)
          .filter((department): department is string => Boolean(department))
      ),
    ].sort();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                           Dashboard Statistics                             */
  /* -------------------------------------------------------------------------- */

  const stats: LeaveStatsSummary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const summary: LeaveStatsSummary = {
      totalRequests: mockLeaveRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      onLeaveToday: 0,
    };

    mockLeaveRequests.forEach((leave) => {
      switch (leave.status) {
        case "PENDING":
          summary.pending++;
          break;

        case "APPROVED":
          summary.approved++;
          break;

        case "REJECTED":
          summary.rejected++;
          break;

        case "CANCELLED":
          summary.cancelled++;
          break;
      }

      if (
        leave.status === "APPROVED" &&
        leave.startDate &&
        leave.endDate
      ) {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);

        startDate.setHours(0, 0, 0, 0);

        // Include the complete end day
        endDate.setHours(23, 59, 59, 999);

        if (today >= startDate && today <= endDate) {
          summary.onLeaveToday++;
        }
      }
    });

    return summary;
  }, []);
    /* -------------------------------------------------------------------------- */
  /*                           Filter Leave Requests                            */
  /* -------------------------------------------------------------------------- */

  const filteredLeaveRequests = useMemo(() => {
    return mockLeaveRequests.filter((leave) => {
      const matchesSearch =
        !normalizedQuery ||
        leave.employeeName.toLowerCase().includes(normalizedQuery) ||
        leave.employeeCode.toLowerCase().includes(normalizedQuery) ||
        leave.reason.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "ALL" || leave.status === statusFilter;

      const matchesLeaveType =
        typeFilter === "ALL" || leave.leaveType === typeFilter;

      const matchesDepartment =
        departmentFilter === "ALL" ||
        leave.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLeaveType &&
        matchesDepartment
      );
    });
  }, [
    normalizedQuery,
    statusFilter,
    typeFilter,
    departmentFilter,
  ]);

  /* -------------------------------------------------------------------------- */
  /*                                Pagination                                  */
  /* -------------------------------------------------------------------------- */

  const totalItems = filteredLeaveRequests.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_PAGE)
  );

  const activePage = Math.min(currentPage, totalPages);

  const paginatedLeaveRequests = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;

    return filteredLeaveRequests.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredLeaveRequests, activePage]);
    /* -------------------------------------------------------------------------- */
  /*                               Event Handlers                               */
  /* -------------------------------------------------------------------------- */

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    resetPagination();
  };

  const handleStatusFilterChange = (
    value: LeaveStatus | "ALL"
  ) => {
    setStatusFilter(value);
    resetPagination();
  };

  const handleTypeFilterChange = (
    value: LeaveType | "ALL"
  ) => {
    setTypeFilter(value);
    resetPagination();
  };

  const handleDepartmentFilterChange = (
    value: string | "ALL"
  ) => {
    setDepartmentFilter(value);
    resetPagination();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
    /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* ---------------------------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------------------------- */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leave Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee leave requests, approvals, balances, and leave history.
          </p>
        </div>

        <Button asChild>
          <Link href="/leave/new">
            <Plus className="mr-2 h-4 w-4" />
            Apply Leave
          </Link>
        </Button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* Statistics */}
      {/* ---------------------------------------------------------------------- */}

      <LeaveStats stats={stats} />

      {/* ---------------------------------------------------------------------- */}
      {/* Filters */}
      {/* ---------------------------------------------------------------------- */}

      <LeaveFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchQueryChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusFilterChange}
        typeFilter={typeFilter}
        onTypeChange={handleTypeFilterChange}
        departmentFilter={departmentFilter}
        onDepartmentChange={handleDepartmentFilterChange}
        departments={departments}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* Leave Table */}
      {/* ---------------------------------------------------------------------- */}

      <LeaveTable
        records={paginatedLeaveRequests}
        currentPage={activePage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
