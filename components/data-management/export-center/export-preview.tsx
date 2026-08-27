'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, HardDrive, CalendarRange, Columns, Loader2 } from 'lucide-react';
import { useExportCenter } from './export-center-context';
import { formatByteSize } from '@/lib/export/formatters';

export default function ExportPreview() {
  const { preview, selectedModule, isPreviewing } = useExportCenter();

  const columns = preview?.columns ?? [];
  const sampleRows = preview?.sampleRows ?? [];

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-4.5 w-4.5 text-zinc-500" />
            <div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
                Extraction Preview Mapping
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Read-only sample from your tenant database (not a full download).
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 py-0.5 px-2 font-mono"
          >
            Target Module: {selectedModule}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {isPreviewing && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading preview…
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/40 text-xs font-medium text-zinc-500">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400">
              Total Rows
            </span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              {preview ? `${preview.totalRows.toLocaleString()} rows` : '—'}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400 flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              Est. Size
            </span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              {preview ? `~ ${formatByteSize(preview.estimatedBytes)}` : '—'}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400 flex items-center gap-1">
              <Columns className="h-3 w-3" />
              Active Fields
            </span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              {columns.length} columns
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400 flex items-center gap-1">
              <CalendarRange className="h-3 w-3" />
              Preview Time
            </span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              {preview
                ? new Date(preview.generatedAt).toLocaleTimeString()
                : '—'}
            </p>
          </div>
        </div>

        {preview?.message && (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {preview.message}
          </p>
        )}

        <div className="overflow-x-auto rounded-lg border border-zinc-150 dark:border-zinc-800">
          <Table className="text-xs text-left w-full min-w-[500px]">
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
              <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="px-4 py-2.5 font-bold font-mono text-zinc-450 uppercase tracking-wide"
                  >
                    {col.label}
                  </TableHead>
                ))}
                {columns.length === 0 && (
                  <TableHead className="px-4 py-2.5">No columns</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {sampleRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={Math.max(columns.length, 1)}
                    className="px-4 py-6 text-center text-zinc-400"
                  >
                    {isPreviewing ? 'Loading…' : 'No sample rows'}
                  </TableCell>
                </TableRow>
              )}
              {sampleRows.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className="px-4 py-3 text-zinc-700 dark:text-zinc-200 font-mono"
                    >
                      {row[col.key] ?? ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
