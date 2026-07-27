'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, AlertCircle, RefreshCw, Clock, History } from 'lucide-react';

interface MockJobRow {
  jobId: string;
  operation: string;
  module: string;
  requestedBy: string;
  requestedOn: string;
  completedOn: string;
  duration: string;
  status: 'Completed' | 'Running' | 'Queued' | 'Failed' | 'Cancelled';
  affectedRecords: string;
}

const mockJobsHistory: MockJobRow[] = [
  {
    jobId: 'BCH-2025-042',
    operation: 'Activate Employees',
    module: 'Employees',
    requestedBy: 'Harshita Sharma',
    requestedOn: 'Feb 15, 2025, 02:40 PM',
    completedOn: 'Feb 15, 2025, 02:41 PM',
    duration: '1m 12s',
    status: 'Completed',
    affectedRecords: '12 rows',
  },
  {
    jobId: 'BCH-2025-041',
    operation: 'Transfer Department',
    module: 'Departments',
    requestedBy: 'Rohan Verma',
    requestedOn: 'Feb 14, 2025, 08:30 AM',
    completedOn: 'Feb 14, 2025, 08:31 AM',
    duration: '45s',
    status: 'Completed',
    affectedRecords: '84 rows',
  },
  {
    jobId: 'BCH-2025-040',
    operation: 'Generate Payroll',
    module: 'Payroll',
    requestedBy: 'Priya Iyer',
    requestedOn: 'Feb 13, 2025, 11:45 AM',
    completedOn: 'Feb 13, 2025, 11:46 AM',
    duration: '55s',
    status: 'Failed',
    affectedRecords: '395 lines',
  },
  {
    jobId: 'BCH-2025-039',
    operation: 'Approve Leave',
    module: 'Leave',
    requestedBy: 'Amit Gupta',
    requestedOn: 'Feb 08, 2025, 02:15 PM',
    completedOn: 'Feb 08, 2025, 02:16 PM',
    duration: '35s',
    status: 'Completed',
    affectedRecords: '28 requests',
  },
];

export default function BulkJobHistory() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <div>
            <CardTitle>Bulk Job History</CardTitle>
            <CardDescription>
              Audit log of bulk operations.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Requested On</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Affected Records</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mockJobsHistory.map((row) => (
              <TableRow key={row.jobId}>
                <TableCell>{row.jobId}</TableCell>
                <TableCell>{row.operation}</TableCell>
                <TableCell>{row.module}</TableCell>
                <TableCell>{row.requestedBy}</TableCell>
                <TableCell>{row.requestedOn}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>{row.affectedRecords}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {row.status === 'Completed' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {row.status === 'Failed' && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    {row.status === 'Running' && (
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                    )}
                    {row.status === 'Queued' && (
                      <Clock className="h-4 w-4 text-orange-600" />
                    )}
                    <span>{row.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}