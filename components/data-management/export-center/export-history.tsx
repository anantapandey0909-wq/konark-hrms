'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, CheckCircle, AlertCircle } from 'lucide-react';
import { useExportCenter } from './export-center-context';

export default function ExportHistory() {
  const { history } = useExportCenter();

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <History className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Recent Export History
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Successful exports recorded in AuditLog for your organization (no file payloads stored).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="text-xs text-left w-full min-w-[700px]">
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
              <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                  Export ID
                </TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                  Target Module
                </TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">
                  Format
                </TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">
                  File Size
                </TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                  Requested By
                </TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                  Timestamp
                </TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {history.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-5 py-8 text-center text-zinc-400"
                  >
                    No export history yet for this organization.
                  </TableCell>
                </TableRow>
              )}
              {history.map((row) => (
                <TableRow
                  key={row.exportId + row.date}
                  className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors"
                >
                  <TableCell className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                    {row.exportId}
                  </TableCell>
                  <TableCell className="px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-100">
                    {row.module}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="font-mono text-[9.5px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold text-zinc-700 dark:text-zinc-300">
                      {row.format}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center font-mono text-zinc-650 dark:text-zinc-350">
                    {row.size}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-zinc-550 dark:text-zinc-400 font-medium">
                    {row.requestedBy}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-zinc-400 dark:text-zinc-500 font-mono">
                    {new Date(row.date).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${\n                        row.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                          : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                      }`}
                    >
                      {row.status === 'Completed' ? (
                        <CheckCircle className="h-3 w-3 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3 w-3 shrink-0" />
                      )}
                      <span>{row.status}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
