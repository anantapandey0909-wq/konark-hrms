"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApprovalCard } from '@/components/manager-portal/approval-card';
import { mockApprovalRequests } from '@/mock/manager-portal';
import { ApprovalRequest, ApprovalType } from '@/types/manager-portal';
import { FileCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApprovalsConsolePage() {
  const [list, setList] = useState<readonly ApprovalRequest[]>(mockApprovalRequests);
  const [activeTab, setActiveTab] = useState<ApprovalType | 'All'>('All');

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setList(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  const categories: readonly (ApprovalType | 'All')[] = [
    'All', 
    'Leave', 
    'Attendance Correction', 
    'Work From Home', 
    'Overtime'
  ];

  const filtered = list.filter((item) => {
    return activeTab === 'All' || item.requestType === activeTab;
  });

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild>
  <Link href="...">
    ...
  </Link>
</Button>

      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="h-7 w-7 text-indigo-500" />
            <span>Authorization Queue</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Approve or reject leave logs, shift rectifications, and overtime reports.
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className="text-xs font-bold h-9 px-4 shrink-0"
          >
            {tab === 'All' ? 'All Requests' : tab}
          </Button>
        ))}
      </div>

      <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Direct Report Requests</CardTitle>
          <CardDescription className="text-xs">
            Filter and authorize outstanding workspace requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs font-semibold">
              No outstanding requests in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((req) => (
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
    </div>
  );
}