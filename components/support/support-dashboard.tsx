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
  Info,
} from "lucide-react";
import { toast } from "sonner";

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

  const metrics = useMemo(() => {
    return calculateSupportMetrics(mockSupportTickets);
  }, []);

  const filteredAndSortedTickets = useMemo(() => {
    let result = searchSupportTickets(mockSupportTickets, filters.search);
    result = filterSupportTickets(
      result,
      filters.status,
      filters.priority,
      filters.category
    );
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

  const handleDemoDelete = async (ticket: SupportTicket) => {
    setIsDeleting(true);
    try {
      // Intentionally non-persistent — Support has no backend in this phase.
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.message("Demo only — ticket was not deleted",
        {
          description:
            "Support Center uses mock data. Changes are not saved to the database.",
        }
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div
        role="status"
        className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="space-y-0.5">
          <p className="font-semibold tracking-tight">
            Demo / mock Support Center
          </p>
          <p className="text-amber-900/80 dark:text-amber-100/80 leading-relaxed">
            Tickets shown here are sample data only. Create, edit, and delete
            actions do not persist to the server or database.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between select-none">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Support Center
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Coordinate technical assistance pipelines, manage employee requests,
            analyze workflow categories, and prioritize critical operational
            blockers.
          </p>
        </div>
        <Button
          onClick={() => {
            toast.message("Demo only — ticket will not be saved",
              {
                description:
                  "Opening the create form for UI preview. Nothing is written to the database.",
              }
            );
            router.push("/dashboard/support/new");
          }}
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Ticket (Demo)
        </Button>
      </div>

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

      <div className="w-full">
        <SupportFilters filters={filters} onFiltersChange={setFilters} />
      </div>

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

      <SupportDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        ticket={selectedTicket}
        loading={isDeleting}
        onConfirm={handleDemoDelete}
      />
    </div>
  );
}
