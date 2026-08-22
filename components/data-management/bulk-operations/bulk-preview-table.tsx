'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import type { BulkEmployeePreviewRow } from '@/types/bulk-operation';

interface BulkPreviewTableProps {
  selectedActionId: string;
  rows: BulkEmployeePreviewRow[];
  isLoading?: boolean;
}

export default function BulkPreviewTable({
  selectedActionId,
  rows,
  isLoading = false,
}: BulkPreviewTableProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-4.5 w-4.5 text-zinc-500" />
            <div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
                Action Preview Mapping
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Structured visualization of changes pending execution across selected records.
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 py-0.5 px-2 font-mono"
          >
            Action: {selectedActionId} · {rows.length} row(s)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-zinc-500">Loading preview…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No employees selected. Select employees in the Employee Directory, then return here to
              preview bulk changes.
            </div>
          ) : (
            <Table className="text-xs text-left w-full min-w-[700px]">
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                    Employee ID
                  </TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                    Employee
                  </TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                    Department
                  </TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                    Current Value
                  </TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                    New Value
                  </TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                    Notes
                  </TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {rows.map((row) => (
                  <TableRow
                    key={row.employeeId}
                    className={`hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors ${
                      row.status === 'invalid'
                        ? 'bg-rose-50/15 dark:bg-rose-950/5'
                        : row.status === 'warning'
                          ? 'bg-amber-50/10 dark:bg-amber-950/5'
                          : ''
                    }`}
                  >
                    <TableCell className="px-5 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-50">
                      {row.employeeCode}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-100">
                      {row.employeeName}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-450">
                      {row.departmentName}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-450 font-mono text-[10.5px]">
                      {row.currentValue}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-950 dark:text-zinc-100 font-mono font-bold text-[10.5px]">
                      {row.newValue}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-450 max-w-[180px] truncate">
                      {row.notes}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      {row.status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          <span>Valid</span>
                        </span>
                      ) : row.status === 'warning' ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Skip</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400">
                          <AlertCircle className="h-3 w-3" />
                          <span>Invalid</span>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
