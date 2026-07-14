import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PayrollStatusBadge } from "@/components/payroll/payroll-status-badge";
import {
  formatPayrollCurrency,
  formatPayrollDate,
  formatPayrollMonth,
} from "@/lib/payroll";
import { cn } from "@/lib/utils";
import type { PayrollRecord } from "@/types/payroll";
import { Eye, Edit } from "lucide-react";

interface PayrollTableProps {
  data: PayrollRecord[];
  loading?: boolean;
  className?: string;
}

export function PayrollTable({ data, loading = false, className }: PayrollTableProps) {
  return (
    <div className={cn("rounded-md border bg-card text-card-foreground", className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payroll Number</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Gross Salary</TableHead>
              <TableHead className="text-right">Net Salary</TableHead>
              <TableHead>Generated Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  Loading payroll records...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No payroll records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.payrollNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{record.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{record.employeeCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{formatPayrollMonth(record.month)}</TableCell>
                  <TableCell>
                    <PayrollStatusBadge status={record.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPayrollCurrency(record.salaryBreakdown.grossSalary)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {formatPayrollCurrency(record.salaryBreakdown.netSalary)}
                  </TableCell>
                  <TableCell>
                    {record.generatedAt ? formatPayrollDate(record.generatedAt) : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        aria-label={`View payroll ${record.payrollNumber}`}
                      >
                        <Link href={`/dashboard/payroll/${record.id}`}>
                          <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                          View
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        aria-label={`Edit payroll ${record.payrollNumber}`}
                      >
                        <Link href={`/dashboard/payroll/${record.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
