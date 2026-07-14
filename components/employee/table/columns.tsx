'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Employee } from '@/types/employee';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowUpDown, Eye, Edit2, UserMinus, Copy } from 'lucide-react';

import type { Department } from "@/types/employee";

const DEPARTMENT_COLORS: Record<Department, string> =  {
  Engineering: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20',
  Product: 'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20',
  Design: 'bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400 border-pink-500/20',
  Marketing: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20',
  Sales: 'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-500/20',
  HR: 'bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 border-teal-500/20',
  Finance: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20',
  Operations: 'bg-neutral-500/10 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-400 border-neutral-500/20',
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERN: 'Intern',
};

export const columns = (
  onEdit: (employee: Employee) => void,
  onDeactivate: (id: string) => void
): ColumnDef<Employee>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          Employee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { id, fullName, email, avatar } = row.original;
      const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

      return (
        <Link href={`/dashboard/employees/${id}`} className="flex items-center gap-3 group">
          <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-800 transition-transform group-hover:scale-105">
            <AvatarImage src={avatar || undefined} alt={fullName} />
            <AvatarFallback className="bg-neutral-100 text-neutral-800 font-medium text-xs dark:bg-neutral-800 dark:text-neutral-200">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-neutral-900 dark:text-neutral-50 tracking-tight group-hover:underline underline-offset-2">
              {fullName}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">{email}</span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'employeeCode',
    header: 'Code',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{row.getValue('employeeCode')}</span>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => {
      const dept = row.getValue('department') as Department ;
      const badgeStyle = DEPARTMENT_COLORS[dept] || DEPARTMENT_COLORS.Operations;

      return (
        <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
          {dept}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
    cell: ({ row }) => {
      const designation = row.getValue('designation') as string;
      const level = row.original.level;

      return (
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-neutral-800 dark:text-neutral-200 font-normal">{designation}</span>
          <span className="text-xs text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
            {level}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'employmentType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('employmentType') as string;
      return (
        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
          {EMPLOYMENT_TYPE_LABELS[type] || type}
        </span>
      );
    },
  },
  {
    accessorKey: 'profileCompletion',
    header: 'Completion',
    cell: ({ row }) => {
      const completion = row.getValue('profileCompletion') as number;
      const isHigh = completion >= 90;
      const isMedium = completion >= 75 && completion < 90;

      return (
        <div className="flex items-center gap-2 max-w-[120px]">
          <span className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 w-8">
            {completion}%
          </span>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isHigh ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-neutral-400'
              }`}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config: Record<string, { label: string; className: string }> = {
        ACTIVE: {
          label: 'Active',
          className: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20',
        },
        INACTIVE: {
          label: 'Inactive',
          className: 'bg-neutral-500/10 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-400 border-neutral-500/20',
        },
        ON_LEAVE: {
          label: 'On Leave',
          className: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20',
        },
        SUSPENDED: {
          label: 'Suspended',
          className: 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-500/20',
        },
      };

      const current = config[status] || config.INACTIVE;

      return (
        <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${current.className}`}>
          {current.label}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-neutral-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] border-neutral-200 dark:border-neutral-800">
            <DropdownMenuLabel className="text-neutral-500 text-xs font-semibold px-2 py-1.5">Actions</DropdownMenuLabel>
            
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/employees/${employee.id}`} className="flex items-center gap-2 cursor-pointer text-sm">
                <Eye className="h-4 w-4 text-neutral-500" />
                <span>View Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(employee)} className="flex items-center gap-2 cursor-pointer text-sm">
              <Edit2 className="h-4 w-4 text-neutral-500" />
              <span>Edit Details</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={async () => {
  try {
    await navigator.clipboard.writeText(employee.employeeCode);
  } catch (error) {
    console.error("Failed to copy employee code", error);
  }
}} 
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <Copy className="h-4 w-4 text-neutral-500" />
              <span>Copy Employee Code</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
            
            <DropdownMenuItem
              onClick={() => onDeactivate(employee.id)}
              className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 text-sm focus:bg-red-50 dark:focus:bg-red-950/30"
            >
              <UserMinus className="h-4 w-4" />
              <span>Deactivate Employee</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
