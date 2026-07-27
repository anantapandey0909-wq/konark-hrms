'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const previewVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

interface MockPayrollRow {
  employeeId: string;
  name: string;
  department: string;
  payrollMonth: string;
  basicSalary: string;
  grossSalary: string;
  netSalary: string;
  status: 'valid' | 'invalid';
  reason?: string;
}

const mockPayrollRows: MockPayrollRow[] = [
  {
    employeeId: 'EMP-088',
    name: 'Meera Deshpande',
    department: 'Engineering',
    payrollMonth: 'February 2025',
    basicSalary: '₹1,20,000',
    grossSalary: '₹1,45,000',
    netSalary: '₹1,32,000',
    status: 'valid'
  },
  {
    employeeId: 'EMP-142',
    name: 'Varun Grover',
    department: 'Product',
    payrollMonth: 'February 2025',
    basicSalary: '₹95,000',
    grossSalary: '₹1,12,000',
    netSalary: '₹1,01,000',
    status: 'valid'
  },
  {
    employeeId: 'EMP-051',
    name: 'Shreya Ghoshal',
    department: 'Marketing',
    payrollMonth: 'February 2025',
    basicSalary: '₹85,000',
    grossSalary: '₹92,000',
    netSalary: '₹88,000',
    status: 'invalid',
    reason: 'Statutory EPF deduction value calculation is unbalanced.'
  },
  {
    employeeId: 'EMP-304',
    name: 'Pranav Mistry',
    department: 'Finance',
    payrollMonth: 'February 2025',
    basicSalary: '₹1,60,500',
    grossSalary: '₹1,95,000',
    netSalary: '₹1,78,000',
    status: 'valid'
  },
  {
    employeeId: 'EMP-211',
    name: 'Karan Johar',
    department: 'Operations',
    payrollMonth: 'February 2025',
    basicSalary: '₹75,000',
    grossSalary: '₹82,000',
    netSalary: '₹1,02,000',
    status: 'invalid',
    reason: 'Net payout violates configured base salary limitations.'
  }
];

export default function PayrollFilePreview() {
  return (
    <motion.div
      variants={previewVariants}
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden h-full">
        <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4.5 w-4.5 text-zinc-500" />
              <div>
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
                  Mapped Payroll Review
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Pre-import analysis grid showing mapped ledger values.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 py-0.5 px-2">
              {mockPayrollRows.length} Rows Parsed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="text-xs text-left w-full min-w-[700px]">
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/80">
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Employee ID</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Employee Name</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Department</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400">Payroll Month</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">Basic / Gross</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">Net Salary</TableHead>
                  <TableHead className="px-5 py-3 font-semibold text-zinc-500 dark:text-zinc-400 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {mockPayrollRows.map((row, idx) => (
                  <TableRow 
                    key={idx} 
                    className={`hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors ${
                      row.status === 'invalid' ? 'bg-rose-50/15 dark:bg-rose-950/5' : ''
                    }`}
                  >
                    <TableCell className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                      {row.employeeId}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-100">
                      {row.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-400 font-medium">
                      {row.department}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-zinc-500 dark:text-zinc-450 font-mono font-medium">
                      {row.payrollMonth}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right font-mono text-zinc-650 dark:text-zinc-350">
                      <div className="flex flex-col items-end leading-tight">
                        <span>{row.basicSalary}</span>
                        <span className="text-[9.5px] text-zinc-400">gross: {row.grossSalary}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right text-zinc-950 dark:text-zinc-100 font-mono font-bold">
                      {row.netSalary}
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}