"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ApprovalRequest } from '@/types/manager-portal';
import { ApprovalCard } from './approval-card';
import { EmptyState } from './empty-state';
import { Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface PendingApprovalsProps {
  readonly approvals: readonly ApprovalRequest[];
}

export function PendingApprovals({ approvals: initialApprovals }: PendingApprovalsProps) {
  const [list, setList] = useState<readonly ApprovalRequest[]>(initialApprovals);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setList(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  const pendingItems = list.filter(item => item.status === 'Pending');

  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            <span>Pending Approvals</span>
          </CardTitle>
          <CardDescription className="text-xs">Awaiting authorization</CardDescription>
        </div>
        <Link 
          href="/dashboard/manager/approvals" 
          className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5 dark:text-indigo-400"
        >
          View All <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {pendingItems.length === 0 ? (
          <EmptyState 
            title="Approvals Clear" 
            description="You have no pending direct-report authorization tasks." 
            icon={ShieldAlert}
          />
        ) : (
          <div className="space-y-3 max-h-[390px] overflow-y-auto pr-1">
            {pendingItems.map((req) => (
              <ApprovalCard 
                key={req.id} 
                request={req} 
                onApprove={(id) => handleAction(id, 'Approved')} 
                onReject={(id) => handleAction(id, 'Rejected')}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}