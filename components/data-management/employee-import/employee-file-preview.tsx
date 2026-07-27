'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const tableContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

interface MockEmployeeRow {
  id: string;
  name: string;
  department: string;
  designation: string;
  dateJoined: string;
  status: 'valid' | 'invalid';
  reason?: string;
}

const mockRows: MockEmployeeRow[] = [
  {
    id: 'EMP-413',
    name: 'Ananya Deshmukh',
    department: 'Engineering',
    designation: 'Staff Engineer',
    dateJoined: '2025-02-15',
    status: 'valid',
  },
  {
    id: 'EMP-414',
    name: 'Kabir Malhotra',
    department: 'Product',
    designation: 'Senior Product Manager',
    dateJoined: '2025-02-10',
    status: 'valid',
  },
  {
    id: 'EMP-415',
    name: 'Riya Sen',
    department: 'Human Resources',
    designation: 'HR Recruiter',
    dateJoined: '2025-02-28',
    status: 'invalid',
    reason: 'Assigned system role key is unmapped.'
  },
  {
    id: 'EMP-416',
    name: 'Samir Joshi',
    department: 'Engineering',
    designation: 'Associate QA Analyst',
    dateJoined: '2025-03-01',
    status: 'valid',
  },
  {
    id: 'EMP-417',
    name: 'Tanvi Shah',
    department: 'Finance',
    designation: 'Accounts Director',
    dateJoined: '2025-02-18',
    status: 'invalid',
    reason: 'Employee ID duplicates an existing active record.'
  }
];

export default function EmployeeFilePreview() {
  return (
    <motion.div
      variants={tableContainerVariants}
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden h-full">
        <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4.5 w-4.5 text-zinc-500" />
              <div>
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
                  Spreadsheet Mapped Review
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Pre-import analysis grid showing mapping configurations.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 py-0.5 px-2">
              Showing {mockRows.length} Mapped Rows
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="text-xs text-left w-full min-w-[650px]">
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Employee ID</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Employee Name</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Department</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Designation</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Joining Date</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {mockRows.map((row) => (
                  <TableRow 
                    key={row.id} 
                    className={`hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors ${
                      row.status === 'invalid' ? 'bg-rose-50/15 dark:bg-rose-950/5' : ''
                    }`}
                  >
                    <TableCell className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                      {row.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-100">
                      {row.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400 font-medium">
                      {row.department}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                      {row.designation}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400 font-mono">
                      {row.dateJoined}
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
                          <span className="text-[9.5px] text-rose-550 dark:text-rose-400 font-medium tracking-tight max-w-[150px] leading-tight block">
                            {row.reason}
                          </span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}