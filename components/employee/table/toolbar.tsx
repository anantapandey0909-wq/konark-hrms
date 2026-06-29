'use client';

import * as React from 'react';
import { EmployeeFilters, Department, EmployeeStatus, EmployeeRole } from '@/types/employee';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Download, Plus, Filter } from 'lucide-react';

interface ToolbarProps {
  filters: EmployeeFilters;
  onFilterChange: (filters: EmployeeFilters) => void;
  onAddClick: () => void;
  onExportClick: () => void;
}

const DEPARTMENTS: (Department | 'ALL')[] = [
  'ALL',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
];

const STATUSES: (EmployeeStatus | 'ALL')[] = ['ALL', 'ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED'];

const ROLES: (EmployeeRole | 'ALL')[] = ['ALL', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'HR_PARTNER', 'DIRECTOR'];

export function Toolbar({ filters, onFilterChange, onAddClick, onExportClick }: ToolbarProps) {
  const isFiltered = filters.search !== '' || filters.department !== 'ALL' || filters.status !== 'ALL' || filters.role !== 'ALL';

  const handleReset = React.useCallback(() => {
  onFilterChange({
    search: "",
    department: "ALL",
    status: "ALL",
    role: "ALL",
  });
}, [onFilterChange]);

  return (
    <div className="flex flex-col gap-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search employees..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9 h-9 border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={filters.department}
            onValueChange={(val) => onFilterChange({ ...filters, department: val as Department | 'ALL' })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[150px] border-neutral-200 dark:border-neutral-800 text-xs">
              <span className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-neutral-400" />
                <SelectValue placeholder="Department" />
              </span>
            </SelectTrigger>
            <SelectContent className="border-neutral-200 dark:border-neutral-800">
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept} className="text-xs">
                  {dept === 'ALL' ? 'All Departments' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(val) => onFilterChange({ ...filters, status: val as EmployeeStatus | 'ALL' })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[130px] border-neutral-200 dark:border-neutral-800 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-neutral-200 dark:border-neutral-800">
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.role}
            onValueChange={(val) => onFilterChange({ ...filters, role: val as EmployeeRole | 'ALL' })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[130px] border-neutral-200 dark:border-neutral-800 text-xs">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="border-neutral-200 dark:border-neutral-800">
              {ROLES.map((role) => (
                <SelectItem key={role} value={role} className="text-xs">
                  {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-9 px-3 text-xs flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <X className="h-3.5 w-3.5" />
            Reset filters
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportClick}
          className="h-9 border-neutral-200 dark:border-neutral-800 text-xs flex items-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg text-neutral-700 dark:text-neutral-300"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button
          size="sm"
          onClick={onAddClick}
          className="h-9 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg px-4"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Employee
        </Button>
      </div>
    </div>
  );
}