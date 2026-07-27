'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, HardDrive, CalendarRange, Columns, FileSpreadsheet } from 'lucide-react';

interface MockPreviewRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
}

const previewRows: MockPreviewRow[] = [
  { col1: 'EMP-001', col2: 'Sanjay Dutt', col3: 'Engineering', col4: 'Director of QA', col5: 'Active' },
  { col1: 'EMP-002', col2: 'Deepika Padukone', col3: 'Product', col4: 'Lead Architect', col5: 'Active' },
  { col1: 'EMP-003', col2: 'Ranveer Singh', col3: 'Marketing', col4: 'Brand Manager', col5: 'Active' }
];

export default function ExportPreview() {
  const currentConfig = {
    moduleName: 'Employees Database',
    records: 412,
    size: '1.45 MB',
    columns: ['employeeId', 'fullName', 'department', 'roleId', 'status'],
    generatedAt: 'Today, 02:40 PM'
  };

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-4.5 w-4.5 text-zinc-500" />
            <div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
                Extraction Preview Mapping
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Live representation of metadata compiled in target snapshots.
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 py-0.5 px-2 font-mono">
            Target Module: {currentConfig.moduleName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Estimation Metadata Block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/40 text-xs font-medium text-zinc-500">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400">Total Rows</span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              {currentConfig.records} rows
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400 flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              File Size
            </span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              ~ {currentConfig.size}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400 flex items-center gap-1">
              <Columns className="h-3 w-3" />
              Active Fields
            </span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              {currentConfig.columns.length} columns
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wide text-zinc-400 flex items-center gap-1">
              <CalendarRange className="h-3 w-3" />
              Compiled Time
            </span>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
              {currentConfig.generatedAt}
            </p>
          </div>
        </div>

        {/* Real Table representation mapping previewRows */}
        <div className="overflow-x-auto rounded-lg border border-zinc-150 dark:border-zinc-800">
          <Table className="text-xs text-left w-full min-w-[500px]">
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
              <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                {currentConfig.columns.map((col) => (
                  <TableHead key={col} className="px-4 py-2.5 font-bold font-mono text-zinc-450 uppercase tracking-wide">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {previewRows.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80">
                  <TableCell className="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-zinc-50">{row.col1}</TableCell>
                  <TableCell className="px-4 py-3 font-semibold text-zinc-800 dark:text-zinc-100">{row.col2}</TableCell>
                  <TableCell className="px-4 py-3 text-zinc-500 dark:text-zinc-450">{row.col3}</TableCell>
                  <TableCell className="px-4 py-3 text-zinc-500 dark:text-zinc-450">{row.col4}</TableCell>
                  <TableCell className="px-4 py-3 text-zinc-550 dark:text-zinc-400 font-medium">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400">
                      {row.col5}
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