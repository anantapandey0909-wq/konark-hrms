'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';

interface MockImportRow {
  id: string;
  module: string;
  fileName: string;
  importedBy: string;
  date: string;
  status: 'Success' | 'Pending' | 'Failed' | 'Processing';
  rowCount: string;
}

const recentImports: MockImportRow[] = [
  {
    id: 'IMP-092',
    module: 'Attendance',
    fileName: 'Biometric_Logs_Feb_14.xlsx',
    importedBy: 'Harshita Sharma',
    date: 'Feb 15, 2025, 06:12 PM',
    status: 'Success',
    rowCount: '1,420 rows'
  },
  {
    id: 'IMP-091',
    module: 'Employees',
    fileName: 'Onboarding_Batch_Q1.xlsx',
    importedBy: 'Rohan Verma',
    date: 'Feb 14, 2025, 08:30 AM',
    status: 'Failed',
    rowCount: '48 rows'
  },
  {
    id: 'IMP-090',
    module: 'Payroll',
    fileName: 'Commission_H2_2024.csv',
    importedBy: 'Priya Iyer',
    date: 'Feb 10, 2025, 11:45 AM',
    status: 'Success',
    rowCount: '110 rows'
  },
  {
    id: 'IMP-089',
    module: 'Leave',
    fileName: 'Roster_Carryover_Revisions.csv',
    importedBy: 'Amit Gupta',
    date: 'Feb 08, 2025, 02:15 PM',
    status: 'Success',
    rowCount: '92 rows'
  },
  {
    id: 'IMP-088',
    module: 'Attendance',
    fileName: 'Terminal_Swipes_W5_Manual.xlsx',
    importedBy: 'Harshita Sharma',
    date: 'Feb 05, 2025, 09:00 AM',
    status: 'Processing',
    rowCount: '240 rows'
  },
  {
    id: 'IMP-087',
    module: 'Shifts',
    fileName: 'Roster_Allocation_Feb.xlsx',
    importedBy: 'Rohan Verma',
    date: 'Feb 01, 2025, 03:45 PM',
    status: 'Pending',
    rowCount: '180 rows'
  }
];

export default function RecentImports() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden h-full">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <History className="h-4.5 w-4.5 text-zinc-500" />
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
              Recent Import Activity
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Audit log of files parsed and written onto internal database models.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="text-xs text-left w-full min-w-[650px]">
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
              <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Category Module</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">File Reference Name</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Imported By</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Timestamp</TableHead>
                <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">Batch Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {recentImports.map((row) => (
                <TableRow 
                  key={row.id} 
                  className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors"
                >
                  <TableCell className="px-5 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {row.module}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4 text-zinc-400 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]" title={row.fileName}>
                          {row.fileName}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{row.rowCount}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-zinc-600 dark:text-zinc-400 font-medium">
                    {row.importedBy}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400 font-mono text-[10.5px]">
                    {row.date}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${
                      row.status === 'Success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                        : row.status === 'Failed'
                        ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                        : row.status === 'Processing'
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40 animate-pulse'
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40'
                    }`}>
                      {row.status === 'Success' && <CheckCircle className="h-3 w-3 shrink-0" />}
                      {row.status === 'Failed' && <AlertCircle className="h-3 w-3 shrink-0" />}
                      {row.status === 'Processing' && <RefreshCw className="h-3 w-3 shrink-0 animate-spin" />}
                      {row.status === 'Pending' && <Clock className="h-3 w-3 shrink-0" />}
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