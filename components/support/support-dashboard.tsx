"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  LifeBuoy,
  ClipboardList,
  Flame,
  CheckCircle,
  Plus,
} from "lucide-react";

import { SupportSummaryCard } from "./support-summary-card";
import { SupportFilters } from "./support-filters";
import { SupportTable } from "./support-table";
import { SupportEmptyState } from "./support-empty-state";
import { SupportDeleteDialog } from "./support-delete-dialog";
import { Button } from "@/components/ui/button";

import { mockSupportTickets } from "@/mock/support";
import {
  DEFAULT_SUPPORT_FILTERS,
  calculateSupportMetrics,
  searchSupportTickets,
  filterSupportTickets,
  sortSupportTickets,
} from "@/lib/support-utils";
import { cn } from "@/lib/utils";
import type { SupportTicket, SupportFiltersState } from "@/types/support";

interface SupportDashboardProps {
  className?: string;
}

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

export function SupportDashboard({ className }: SupportDashboardProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<SupportFiltersState>(DEFAULT_SUPPORT_FILTERS);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Safely calculate system metrics
  const metrics = useMemo(() => {
    return calculateSupportMetrics(mockSupportTickets);
  }, []);

  // Filter and sort the ticket dataset memoized to prevent expensive computations
  const filteredAndSortedTickets = useMemo(() => {
    let result = searchSupportTickets(mockSupportTickets, filters.search);
    result = filterSupportTickets(result, filters.status, filters.priority, filters.category);
    return sortSupportTickets(result, filters.sortBy, filters.sortOrder);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_SUPPORT_FILTERS);
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    router.push(`/dashboard/support/${ticket.id}`);
  };

  const handleEditTicket = (ticket: SupportTicket) => {
    router.push(`/dashboard/support/${ticket.id}/edit`);
  };

  const handleDeleteTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTicket) return;
    setIsDeleting(true);
    try {
      // Backend action integration placeholder
      console.log(`Deleted support ticket: #${selectedTicket.ticketNumber}`);
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error("An error occurred during ticket deletion:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Page Header section matching corporate layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between select-none">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Support Center
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Coordinate technical assistance pipelines, manage employee requests, analyze workflow categories, and prioritize critical operational blockers.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/support/new")}
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Metrics section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <SupportSummaryCard
            title="Total Tickets"
            value={metrics.total}
            description="Submitted requests in system"
            icon={ClipboardList}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SupportSummaryCard
            title="Open Status"
            value={metrics.open}
            description="Awaiting processing queue"
            icon={LifeBuoy}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SupportSummaryCard
            title="In Progress"
            value={metrics.inProgress}
            description="Assigned engineering queues"
            icon={Flame}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SupportSummaryCard
            title="Resolved Tickets"
            value={metrics.resolved}
            description="Successfully completed cases"
            icon={CheckCircle}
          />
        </motion.div>
      </motion.div>

      {/* Filters section */}
      <div className="w-full">
        <SupportFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Content Area (Table or Empty State) */}
      <div className="w-full">
        {filteredAndSortedTickets.length === 0 ? (
          <SupportEmptyState
            title="No Matching Tickets Found"
            description="We couldn't locate any support records matching your active filters. Try resetting search parameters."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <SupportTable
            tickets={filteredAndSortedTickets}
            onView={handleViewTicket}
            onEdit={handleEditTicket}
            onDelete={handleDeleteTicket}
          />
        )}
      </div>

      {/* Reusable Delete Dialog */}
      <SupportDeleteDialog
  open={isDeleteDialogOpen}
  onOpenChange={setIsDeleteDialogOpen}
  ticket={selectedTicket}
  loading={isDeleting}
  onConfirm={async (ticket) => {
    setIsDeleting(true);

    try {
      console.log(`Deleted support ticket: #${ticket.ticketNumber}`);

      // TODO: Replace with backend delete API
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
    }
  }}
/>
    </div>
  );
}
