"use client";

import React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 text-xs font-semibold"
      >
        Employee
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const employee = row.original;
      const fullName = `${employee.firstName} ${employee.lastName}`;
      const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {employee.avatarUrl ? (
              <AvatarImage src={employee.avatarUrl} alt={fullName} />
            ) : null}
            <AvatarFallback className="text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm text-foreground truncate">{fullName}</span>
            <span className="text-xs text-muted-foreground truncate">{employee.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
    cell: ({ row }) => {
      return <span className="font-mono text-xs text-muted-foreground">{row.getValue("employeeId")}</span>;
    },
  },
  {
    accessorKey: "departmentId",
    header: "Department",
    cell: ({ row }) => {
      const deptId = row.getValue("departmentId") as string | null;
      const label = deptId ? deptId.replace("dept-", "").replace("-", " ") : "General";
      return <span className="capitalize text-xs font-medium text-foreground">{label}</span>;
    },
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => {
      return <span className="text-xs text-muted-foreground">{row.getValue("designation")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            status === "ACTIVE" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            status === "ON_LEAVE" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
            status === "INACTIVE" && "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
            status === "TERMINATED" && "bg-red-500/10 text-red-600 border-red-500/20"
          )}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joiningDate",
    header: "Joining Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("joiningDate") as string;
      return <span className="text-xs text-muted-foreground tabular-nums">{formatDate(dateStr)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/employees/${employee.id}`} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/employees/${employee.id}/edit`} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];