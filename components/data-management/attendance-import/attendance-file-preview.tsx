'use client';

import React, { useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAttendanceImport } from './attendance-import-context';

const tableContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function AttendanceFilePreview() {
  const { rows, fileName, setFileFromText, clearFile } = useAttendanceImport();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setFileFromText(file.name, text);
    e.target.value = '';
  };

  return (
    <motion.div variants={tableContainerVariants}>
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden h-full">
        <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center space-x-2">
              <Eye className="h-4.5 w-4.5 text-zinc-500" />
              <div>
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
                  Terminal Log Review
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  {fileName
                    ? `Source: ${fileName}`
                    : 'Upload a CSV to preview mapped attendance rows before commit.'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 py-0.5 px-2"
              >
                Showing {rows.length} Mapped Rows
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No file loaded. Download the template, fill attendance rows, then
              select the CSV file to review. Blank trailing rows are ignored.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="text-xs text-left w-full min-w-[750px]">
                <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                  <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                      Employee ID
                    </TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                      Date
                    </TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                      Check In/Out
                    </TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                      Hours
                    </TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                      Status
                    </TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                      Mode
                    </TableHead>
                    <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">
                      Validation
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {rows.map((row) => {
                    const employeeId =
                      row.data?.employeeId ?? row.raw.employeeId ?? `row-${row.rowNumber}`;
                    const date =
                      row.data?.attendanceDate ?? row.raw.attendanceDate ?? '—';
                    const cin =
                      (row.data?.checkIn || row.raw.checkIn || '—') as string;
                    const cout =
                      (row.data?.checkOut || row.raw.checkOut || '—') as string;
                    const statusVal =
                      row.data?.status ?? row.raw.status ?? '—';
                    const modeVal =
                      row.data?.workMode ?? row.raw.workMode ?? '—';
                    const reason = row.errors.map((e) => e.message).join('; ');

                    return (
                      <TableRow
                        key={`${row.rowNumber}-${employeeId}`}
                        className={`hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors ${
                          row.status === 'invalid'
                            ? 'bg-rose-50/15 dark:bg-rose-950/5'
                            : ''
                        }`}
                      >
                        <TableCell className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                          {employeeId}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400 font-mono">
                          {date}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400 font-mono">
                          {cin} – {cout}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-zinc-700 dark:text-zinc-200 font-mono">
                          {row.previewHours != null
                            ? `${row.previewHours.toFixed(2)}h`
                            : '—'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                          {statusVal}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                          {modeVal}
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
                                <span className="text-[9.5px] text-rose-600 dark:text-rose-400 font-medium tracking-tight max-w-[180px] leading-tight block text-right">
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
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
