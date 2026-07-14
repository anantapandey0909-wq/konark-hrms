'use client';

import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Employee } from '@/types/employee';
import { columns } from './columns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
interface EmployeeTableProps {
  data: Employee[];
  isLoading?: boolean;
  onEdit: (employee: Employee) => void;
  onDeactivate: (id: string) => void;
}
export function EmployeeTable({
  data,
  isLoading = false,
  onEdit,
  onDeactivate,
}: EmployeeTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const tableColumns = React.useMemo(
  () => columns(onEdit, onDeactivate),
  [onEdit, onDeactivate]
);

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

  if (isLoading) {
    return (
      <div className="flex h-[350px] w-full flex-col items-center justify-center border border-neutral-100 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="mt-2 text-xs text-neutral-500">Retrieving directory assets...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2.5">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            {selectedRowsCount} item{selectedRowsCount > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold rounded-md border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Bulk Change Status
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 text-xs font-semibold rounded-md bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800"
            >
              Bulk Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
        <Table className="w-full">
          <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-neutral-150 dark:border-neutral-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-11 text-neutral-500 text-xs font-semibold px-4 tracking-tight">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-b border-neutral-150 dark:border-neutral-800 transition-colors hover:bg-neutral-50/30 dark:hover:bg-neutral-900/20 data-[state=selected]:bg-neutral-50/50 dark:data-[state=selected]:bg-neutral-900/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={tableColumns.length} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <AlertCircle className="h-7 w-7 text-neutral-400" />
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No employees found</p>
                    <p className="text-xs text-neutral-400 max-w-[280px]">
                      Try adjusting your custom filter inputs or keywords to explore directory items.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-1 px-1">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Showing page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount() || 1}
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
