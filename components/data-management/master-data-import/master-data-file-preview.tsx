'use client';

import React, { useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MasterDataType } from './master-data-selector';
import { useDepartmentImport } from './department-import-context';

const previewVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

interface ShiftMockRow {
  shiftName: string;
  startTime: string;
  endTime: string;
  totalHours: string;
  status: 'valid' | 'invalid';
  reason?: string;
}

const mockShifts: ShiftMockRow[] = [
  { shiftName: 'General Shift', startTime: '09:00 AM', endTime: '06:00 PM', totalHours: '9h', status: 'valid' },
  { shiftName: 'Night Shift B', startTime: '10:00 PM', endTime: '07:00 AM', totalHours: '9h', status: 'valid' },
  { shiftName: 'Weekend Rotation', startTime: '08:00 AM', endTime: '08:00 PM', totalHours: '12h', status: 'invalid', reason: 'Shift working hours exceed corporate overtime thresholds.' }
];

interface MasterDataFilePreviewProps {
  selectedType: MasterDataType;
}

export default function MasterDataFilePreview({ selectedType }: MasterDataFilePreviewProps) {
  const isDepartments = selectedType === 'departments';
  const isShift = selectedType === 'shifts';
  const { rows, fileName, setFileFromText, clearFile } = useDepartmentImport();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setFileFromText(file.name, text);
    e.target.value = '';
  };

  return (
    <motion.div variants={previewVariants}>
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden h-full">
        <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center space-x-2">
              <Eye className="h-4.5 w-4.5 text-zinc-500" />
              <div>
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
                  Registry Review Grid
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  {isDepartments
                    ? fileName
                      ? `Source: ${fileName}`
                      : 'Upload a Department CSV to preview mapped rows.'
                    : 'Pre-import validation grid of parsed structure records.'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isDepartments && (
                <>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => void onFileChange(e)}
                  />
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Select File
                  </button>
                  {rows.length > 0 && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    >
                      Clear
                    </button>
                  )}
                </>
              )}
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 py-0.5 px-2"
              >
                {isDepartments
                  ? `${rows.length} Rows Logged`
                  : isShift
                    ? '3 Rows Logged'
                    : 'Preview unavailable'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isDepartments ? (
              rows.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No file loaded. Download the Department template, fill rows,
                  then select the CSV. Blank rows are ignored.
                </div>
              ) : (
                <Table className="text-xs text-left w-full min-w-[600px]">
                  <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                    <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                      <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                        Department Code
                      </TableHead>
                      <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                        Department Name
                      </TableHead>
                      <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                        Description
                      </TableHead>
                      <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                        Status
                      </TableHead>
                      <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">
                        Validation
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {rows.map((row) => {
                      const code =
                        row.data?.departmentCode ??
                        row.raw.departmentCode ??
                        `row-${row.rowNumber}`;
                      const name =
                        row.data?.departmentName ?? row.raw.departmentName ?? '—';
                      const description =
                        row.data?.description ?? row.raw.description ?? '—';
                      const statusVal =
                        row.data?.status ?? row.raw.status ?? '—';
                      const reason = row.errors.map((e) => e.message).join('; ');

                      return (
                        <TableRow
                          key={`${row.rowNumber}-${code}`}
                          className={`hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors ${
                            row.status === 'invalid'
                              ? 'bg-rose-50/15 dark:bg-rose-950/5'
                              : ''
                          }`}
                        >
                          <TableCell className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                            {code}
                          </TableCell>
                          <TableCell className="px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-100">
                            {name}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">
                            {description || '—'}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                            {statusVal}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-right">
                            {row.status === 'valid' ? (
                              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                <CheckCircle className="h-3 w-3" />
                                <span>Valid</span>
                              </span>
                            ) : (
                              <div className="flex flex-col items-end gap-1">
                                <span className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>Invalid</span>
                                </span>
                                {reason && (
                                  <span className="text-[9.5px] text-rose-600 dark:text-rose-400 font-medium tracking-tight max-w-[150px] leading-tight block text-right">
                                    {reason}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )
            ) : isShift ? (
              <Table className="text-xs text-left w-full min-w-[600px]">
                <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                  <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Shift Identifier</TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">Start Time</TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">End Time</TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-center">Working Hours</TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {mockShifts.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className={`hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors ${
                        row.status === 'invalid' ? 'bg-rose-50/15 dark:bg-rose-950/5' : ''
                      }`}
                    >
                      <TableCell className="px-5 py-4 font-bold text-zinc-800 dark:text-zinc-105">
                        {row.shiftName}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center text-zinc-500 dark:text-zinc-400 font-mono">
                        {row.startTime}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center text-zinc-500 dark:text-zinc-400 font-mono">
                        {row.endTime}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center text-zinc-950 dark:text-zinc-100 font-mono font-bold">
                        {row.totalHours}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        {row.status === 'valid' ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400 animate-pulse">
                              <AlertCircle className="h-3 w-3" />
                              <span>Invalid</span>
                            </span>
                            <span className="text-[9.5px] text-rose-550 dark:text-rose-400 font-medium tracking-tight max-w-[150px] leading-tight block text-right">
                              {row.reason}
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-xs text-zinc-500">
                Import for this registry type is not available in Phase 7E.
                Select Departments to import CSV master data.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
