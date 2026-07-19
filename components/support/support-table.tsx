"use client";

import * as React from "react";
import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SupportStatusBadge } from "./support-status-badge";
import { SupportPriorityBadge } from "./support-priority-badge";
import { formatCategory, formatDate } from "@/lib/support-utils";
import type { SupportTicket } from "@/types/support";

interface SupportTableProps {
  tickets: SupportTicket[];
  loading?: boolean;
  onView?: (ticket: SupportTicket) => void;
  onEdit?: (ticket: SupportTicket) => void;
  onDelete?: (ticket: SupportTicket) => void;
}

export function SupportTable({
  tickets,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: SupportTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="h-[240px] flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse select-none">
            Retrieving support workspace records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 select-none">
              <TableHead className="w-[120px] font-semibold text-foreground">
                Ticket ID
              </TableHead>
              <TableHead className="min-w-[180px] font-semibold text-foreground">
                Employee
              </TableHead>
              <TableHead className="min-w-[240px] font-semibold text-foreground">
                Subject
              </TableHead>
              <TableHead className="w-[140px] font-semibold text-foreground">
                Category
              </TableHead>
              <TableHead className="w-[125px] font-semibold text-foreground">
                Priority
              </TableHead>
              <TableHead className="w-[130px] font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="w-[120px] font-semibold text-foreground">
                Created
              </TableHead>
              <TableHead className="w-[70px] text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const employeeName = ticket.employee?.fullName || `Employee (${ticket.employeeId.slice(0, 8)})`;
              const employeeEmail = ticket.employee?.email || "N/A";
              const employeeAvatar = ticket.employee?.avatarUrl;

              const initials = employeeName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <TableRow key={ticket.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                    #{ticket.ticketNumber}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={employeeAvatar} alt={employeeName} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {employeeName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {employeeEmail}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col max-w-[320px]">
                      <span className="text-sm font-medium text-foreground truncate">
                        {ticket.subject}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {ticket.description}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm font-medium text-foreground">
                    {formatCategory(ticket.category)}
                  </TableCell>

                  <TableCell>
                    <SupportPriorityBadge priority={ticket.priority} />
                  </TableCell>

                  <TableCell>
                    <SupportStatusBadge status={ticket.status} />
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(ticket.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open ticket actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Actions Menu
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView?.(ticket)} className="gap-2 text-sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          View Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(ticket)} className="gap-2 text-sm">
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                          Edit Ticket
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(ticket)}
                          className="gap-2 text-sm text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}