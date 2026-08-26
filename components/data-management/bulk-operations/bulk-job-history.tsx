'use client';

import React, { useEffect, useState } from 'react';
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
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  History,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchBulkJobHistory } from '@/lib/data/bulk-history';
import type { BulkJobHistoryRow } from '@/types/bulk-operation';

export interface BulkJobHistoryProps {
  /** Bump to reload history after a successful bulk commit. */
  refreshKey?: number;
}

export default function BulkJobHistory({ refreshKey = 0 }: BulkJobHistoryProps) {
  const [rows, setRows] = useState<BulkJobHistoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchBulkJobHistory();
        if (!cancelled) setRows(data);
      } catch (error: unknown) {
        if (!cancelled) {
          setRows([]);
          toast.error(
            error instanceof Error
              ? error.message
              : 'Failed to load bulk job history.'
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

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
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading history…</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
            <History className="h-8 w-8 stroke-[1.5] text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground">
              No bulk operations have been recorded yet.
            </p>
            <p className="text-xs max-w-sm">
              Successful activate, deactivate, department transfer, and manager
              assignment commits will appear here.
            </p>
          </div>
        ) : (
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
              {rows.map((row) => (
                <TableRow key={row.jobId}>
                  <TableCell className="font-mono text-xs">{row.jobId}</TableCell>
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
        )}
      </CardContent>
    </Card>
  );
}
