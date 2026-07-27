'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { HistoryJobItem } from './history-dashboard';

interface ImportHistoryTableProps {
  jobs: HistoryJobItem[];
  selectedJobId: string;
  onSelectJob: (job: HistoryJobItem) => void;
}

export default function ImportHistoryTable({ jobs, selectedJobId, onSelectJob }: ImportHistoryTableProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <History className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Pipeline Operations Registry
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Audit log containing all previous structural import and export operations.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="text-xs text-left w-full min-w-[750px]">
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
              <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Job ID / File</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Operation</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Module</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Author</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">Process Period</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {jobs.map((row) => {
                const isSelected = selectedJobId === row.id;
                return (
                  <TableRow 
                    key={row.id} 
                    onClick={() => onSelectJob(row)}
                    className={`cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/80 ${
                      isSelected 
                        ? 'bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-indigo-50/30' 
                        : 'hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20'
                    }`}
                  >
                    <TableCell className="px-5 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      <div className="flex items-center space-x-2.5">
                        <FileSpreadsheet className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
                        <div>
                          <p className="font-mono text-[10px] text-zinc-450">{row.id}</p>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[160px]" title={row.fileName}>
                            {row.fileName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {row.operation === 'Import' ? (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 py-0.5 px-2 rounded border border-indigo-100 dark:border-indigo-900/40">
                          <ArrowDownLeft className="h-3 w-3" />
                          Import
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 py-0.5 px-2 rounded border border-emerald-100 dark:border-emerald-900/40">
                          <ArrowUpRight className="h-3 w-3" />
                          Export
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      {row.module}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-550 dark:text-zinc-400">
                      {row.requestedBy}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-zinc-500 dark:text-zinc-400 font-mono text-[10px]">
                      <div className="flex flex-col items-center leading-tight">
                        <span>{row.completedAt.split(',')[1]?.trim() || row.completedAt}</span>
                        <span className="text-[9px] text-zinc-400 font-sans mt-0.5">Dur: {row.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${
                        row.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                          : row.status === 'Failed'
                          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                      }`}>
                        {row.status === 'Completed' && <CheckCircle className="h-3 w-3 shrink-0" />}
                        {row.status === 'Failed' && <AlertCircle className="h-3 w-3 shrink-0" />}
                        <span>{row.status}</span>
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}