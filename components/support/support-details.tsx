"use client";

import * as React from "react";
import { formatCategory, formatDate } from "@/lib/support-utils";
import { SupportStatusBadge } from "./support-status-badge";
import { SupportPriorityBadge } from "./support-priority-badge";
import { Calendar, User, ArrowLeft, Edit2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SupportTicket } from "@/types/support";

interface SupportDetailsProps {
  ticket: SupportTicket;
  onEdit?: (ticket: SupportTicket) => void;
  onBack?: () => void;
}

export function SupportDetails({ ticket, onEdit, onBack }: SupportDetailsProps) {
  const employeeName = ticket.employee?.fullName || "N/A";
  const employeeEmail = ticket.employee?.email || "N/A";
  const employeeAvatar = ticket.employee?.avatarUrl;

  const initials = employeeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Detail Operations Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between select-none">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 rounded-lg border border-border"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go back to support directory</span>
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                #{ticket.ticketNumber}
              </span>
              <span className="text-xs text-muted-foreground">
                Submitted {formatDate(ticket.createdAt)}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground mt-1">
              {ticket.subject}
            </h1>
          </div>
        </div>

        {onEdit && (
          <Button onClick={() => onEdit(ticket)} size="sm" className="gap-1.5 self-start sm:self-auto shadow-sm">
            <Edit2 className="h-4 w-4" />
            Edit State
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Core Content Description Block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-muted pb-2">
              Issue Diagnosis Description
            </h3>
            <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Simulated History Activity Timeline */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-foreground border-b border-muted pb-2">
              Ticket Operations Timeline
            </h3>
            <div className="relative border-l border-muted-foreground/20 pl-4 ml-2 space-y-6">
              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">
                    Ticket Registered Automatically
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-500 ring-4 ring-background" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">
                    State Synchronized with Operational DB
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(ticket.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Metadata Block */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-foreground border-b border-muted pb-2">
              Ticket Attributes
            </h3>

            {/* Requestor Profile */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground block">
                Requestor
              </span>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={employeeAvatar} alt={employeeName} />
                  <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {employeeName}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {employeeEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Category metadata */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground block">
                Category
              </span>
              <span className="text-sm font-semibold text-foreground">
                {formatCategory(ticket.category)}
              </span>
            </div>

            {/* Priority Badge metadata */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground block">
                Priority
              </span>
              <SupportPriorityBadge priority={ticket.priority} />
            </div>

            {/* Status Badge metadata */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground block">
                Status
              </span>
              <SupportStatusBadge status={ticket.status} />
            </div>

            {/* Timestamps */}
            <div className="space-y-3 pt-3 border-t border-muted/50 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Opened: {formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Updated: {formatDate(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}