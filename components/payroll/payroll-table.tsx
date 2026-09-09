"use client";

import * as React from "react";
import { MoreHorizontal, Eye, Edit2, CheckCircle, CreditCard, Ban } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PayrollRecord } from "@/types/payroll";
import { formatINR, formatMonthName } from "@/lib/payroll/formatters";
import { PayrollStatusBadge } from "./payroll-status-badge";

export interface PayrollTableProps {
  readonly records: readonly PayrollRecord[];
  readonly isLoading?: boolean;
  readonly onViewDetails: (record: PayrollRecord) => void;
  readonly onEdit?: (record: PayrollRecord) => void;
  readonly onApprove?: (record: PayrollRecord) => void;
  readonly onPay?: (record: PayrollRecord) => void;
  readonly onCancel?: (record: PayrollRecord) => void;
}

export function PayrollTable({
  records,
  isLoading = false,
  onViewDetails,
  onEdit,
  onApprove,
  onPay,
  onCancel,
}: PayrollTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Payroll No.</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Gross Salary</TableHead>
              <TableHead className="text-right">Net Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell>
                  <div className="space-y-2">
                    <div className="h-4 w-[140px] rounded bg-slate-100 dark:bg-slate-800"></div>
                    <div className="h-3 w-[70px] rounded bg-slate-50 dark:bg-slate-900"></div>
                  </div>
                </TableCell>
                <TableCell><div className="h-4 w-[100px] rounded bg-slate-100 dark:bg-slate-800"></div></TableCell>
                <TableCell><div className="h-4 w-[120px] rounded bg-slate-100 dark:bg-slate-800"></div></TableCell>
                <TableCell><div className="h-4 w-[150px] rounded bg-slate-100 dark:bg-slate-800"></div></TableCell>
                <TableCell><div className="ml-auto h-4 w-[80px] rounded bg-slate-100 dark:bg-slate-800"></div></TableCell>
                <TableCell><div className="ml-auto h-4 w-[80px] rounded bg-slate-100 dark:bg-slate-800"></div></TableCell>
                <TableCell><div className="h-6 w-[70px] rounded bg-slate-100 dark:bg-slate-800"></div></TableCell>
                <TableCell><div className="h-8 w-8 rounded bg-slate-100 dark:bg-slate-800"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-950">
        <Ban className="h-10 w-10 text-slate-400" />
        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-50">No payroll records</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          No records found matching the active criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Payroll No.</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Month/Year</TableHead>
            <TableHead className="text-right">Gross Salary</TableHead>
            <TableHead className="text-right">Net Salary</TableHead>
            <TableHead>Pay Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
              <TableCell className="font-medium">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {record.employeeName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {record.employeeCode} • {record.designation}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-300">
                {record.payrollNumber}
              </TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                {record.department.name}
              </TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                {formatMonthName(record.month)} {record.year}
              </TableCell>
              <TableCell className="text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatINR(record.salaryBreakdown.grossSalary)}
              </TableCell>
              <TableCell className="text-right text-sm font-semibold text-slate-950 dark:text-slate-50">
                {formatINR(record.salaryBreakdown.netSalary)}
              </TableCell>
              <TableCell className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {new Date(record.payPeriodStart).toLocaleDateString()} – {new Date(record.payPeriodEnd).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <PayrollStatusBadge status={record.status} />
              </TableCell>
              <TableCell className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 whitespace-nowrap">
                <div>Gen: {new Date(record.generatedAt).toLocaleDateString()}</div>
                {record.paidAt && <div>Paid: {new Date(record.paidAt).toLocaleDateString()}</div>}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Actions"
                      aria-label="Actions Menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem onClick={() => onViewDetails(record)}>
                      <Eye className="mr-2 h-4 w-4 text-slate-500" />
                      View Details
                    </DropdownMenuItem>

                    {onEdit && record.status === "DRAFT" && (
                      <DropdownMenuItem onClick={() => onEdit(record)}>
                        <Edit2 className="mr-2 h-4 w-4 text-slate-500" />
                        Edit Details
                      </DropdownMenuItem>
                    )}

                    {onApprove && record.status === "PENDING" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onApprove(record)}>
                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                          Approve
                        </DropdownMenuItem>
                      </>
                    )}

                    {onCancel &&
                      (record.status === "DRAFT" ||
                        record.status === "PENDING" ||
                        record.status === "APPROVED") && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onCancel(record)}
                          className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Cancel Payroll
                        </DropdownMenuItem>
                      </>
                    )}

                    {onPay && record.status === "APPROVED" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onPay(record)}>
                          <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                          Process Payment
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
