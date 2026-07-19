"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SupportTicket } from "@/types/support";

interface SupportDeleteDialogProps {
  open: boolean;
  ticket: SupportTicket | null;
  loading?: boolean;
  onConfirm: (ticket: SupportTicket) => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export function SupportDeleteDialog({
  open,
  ticket,
  loading = false,
  onConfirm,
  onOpenChange,
}: SupportDeleteDialogProps) {
  if (!ticket) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[440px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <AlertDialogTitle className="font-semibold">
              Delete Support Ticket
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-sm leading-relaxed text-muted-foreground">
            This action cannot be undone. You are about to permanently delete support request{" "}
            <strong className="text-foreground font-semibold">
              #{ticket.ticketNumber} ({ticket.subject})
            </strong>
            . This will remove all diagnostics, historic notes, and system audit history from our workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm(ticket);
            }}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 font-medium shadow-sm transition-colors"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete Ticket"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}