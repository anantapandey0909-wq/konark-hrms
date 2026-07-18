"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Building2, CheckCircle2, Users, Wallet } from "lucide-react";
import { DepartmentSummaryCard } from "./department-summary-card";
import { DepartmentFilters, DEFAULT_DEPARTMENT_FILTERS } from "./department-filters";
import { DepartmentTable } from "./department-table";
import { DepartmentEmptyState } from "./department-empty-state";
import { DepartmentDeleteDialog } from "./department-delete-dialog";
import { cn } from "@/lib/utils";
import type {
  ResolvedDepartment,
  DepartmentSummary,
  DepartmentFilters as IDepartmentFilters,
} from "@/types/department";

interface DepartmentDashboardProps {
  departments: ResolvedDepartment[];
  summary: DepartmentSummary;
  loading?: boolean;
  className?: string;
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export function DepartmentDashboard({
  departments,
  summary,
  loading = false,
  className,
}: DepartmentDashboardProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<IDepartmentFilters>(DEFAULT_DEPARTMENT_FILTERS);

  // Dialog & Deletion State
  const [selectedDepartment, setSelectedDepartment] = useState<ResolvedDepartment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredAndSortedDepartments = useMemo(() => {
    let result = [...departments];

    // 1. Text Search Filter (name, code, description, head or manager)
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(
        (dept) =>
          dept.name.toLowerCase().includes(query) ||
          dept.code.toLowerCase().includes(query) ||
          dept.description.toLowerCase().includes(query) ||
          dept.headEmployee?.fullName.toLowerCase().includes(query) ||
          dept.managerEmployee?.fullName.toLowerCase().includes(query)
      );
    }

    // 2. Status Option Filter
    if (filters.status !== "ALL") {
      result = result.filter((dept) => dept.status === filters.status);
    }

    // 3. Sorting Engine
    result.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (filters.sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (filters.sortBy === "code") {
        valA = a.code.toLowerCase();
        valB = b.code.toLowerCase();
      } else if (filters.sortBy === "employeeCount") {
        valA = a.employeeCount;
        valB = b.employeeCount;
      } else if (filters.sortBy === "budget") {
        valA = a.budget.allocated;
        valB = b.budget.allocated;
      } else if (filters.sortBy === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return filters.sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [departments, filters]);

  const summaryCardsData = [
    {
      id: "total-depts",
      title: "Total Departments",
      value: summary.totalDepartments,
      description: "Registered corporate structures",
      icon: Building2,
    },
    {
      id: "active-depts",
      title: "Active Departments",
      value: summary.activeDepartments,
      description: `${summary.inactiveDepartments} currently inactive`,
      icon: CheckCircle2,
    },
    {
      id: "total-employees",
      title: "Total Employees",
      value: summary.totalEmployees.toLocaleString("en-IN"),
      description: "Across all active business units",
      icon: Users,
    },
    {
      id: "total-budget",
      title: "Total Allocated Budget",
      value: inrFormatter.format(summary.totalBudget),
      description: "Combined organizational budget cap",
      icon: Wallet,
    },
  ];

  const handleResetFilters = () => {
    setFilters(DEFAULT_DEPARTMENT_FILTERS);
  };

  const handleViewDepartment = (department: ResolvedDepartment) => {
    router.push(`/dashboard/departments/${department.id}`);
  };

  const handleEditDepartment = (department: ResolvedDepartment) => {
    router.push(`/dashboard/departments/${department.id}/edit`);
  };

  const handleDeleteDepartment = (department: ResolvedDepartment) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (department: ResolvedDepartment) => {
    setIsDeleting(true);
    try {
      // TODO: Replace with deleteDepartment() API call during backend integration.
      console.log(`Deleted department: ${department.name} (${department.id})`);
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error("Failed to delete department:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 1. Header Information */}
      <div className="space-y-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Department Directory
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Coordinate organizational divisions, monitor allocation thresholds, inspect operational summaries, and allocate unit structural roles.
        </p>
      </div>

      {/* 2. Top Metric Summaries Block */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {summaryCardsData.map((card) => (
          <motion.div key={card.id} variants={itemVariants}>
            <DepartmentSummaryCard
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 3. Operational Toolbar Filters */}
      <div className="w-full">
        <DepartmentFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* 4. Table Panel Workspace / Empty State Case */}
      <div className="w-full">
        {!loading && filteredAndSortedDepartments.length === 0 ? (
          <DepartmentEmptyState
            title="No Matching Departments Found"
            description="We couldn't locate any departments that fit your filter criteria. Try resetting search parameters."
            actionLabel="Reset Active Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <DepartmentTable
            departments={filteredAndSortedDepartments}
            loading={loading}
            onView={handleViewDepartment}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
          />
        )}
      </div>

      {/* 5. Delete Confirmation Modal Dialog */}
      <DepartmentDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        department={selectedDepartment}
      />
    </div>
  );
}