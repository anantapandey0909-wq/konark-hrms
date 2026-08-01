"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ApprovalRequest } from '@/types/manager-portal';
import { Calendar, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface ApprovalCardProps {
  readonly request: ApprovalRequest;
  readonly onApprove: (id: string) => void;
  readonly onReject: (id: string) => void;
}

export function ApprovalCard({ request, onApprove, onReject }: ApprovalCardProps) {
  const getPriorityClass = (priority: ApprovalRequest['priority']) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/10 text-rose-700 border-rose-200/30 dark:text-rose-400';
      case 'High':
        return 'bg-amber-500/10 text-amber-700 border-amber-200/30 dark:text-amber-400';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-700 border-blue-200/30 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getRequestBadge = (type: ApprovalRequest['requestType']) => {
    switch (type) {
      case 'Leave':
        return <Badge variant="outline" className="border-indigo-500/20 text-indigo-600 bg-indigo-500/5">Leave Request</Badge>;
      case 'Attendance Correction':
        return <Badge variant="outline" className="border-cyan-500/20 text-cyan-600 bg-cyan-500/5">Correction</Badge>;
      case 'Overtime':
        return <Badge variant="outline" className="border-purple-500/20 text-purple-600 bg-purple-500/5">Overtime</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-500/20 text-slate-600 bg-slate-500/5">WFH Request</Badge>;
    }
  };

  return (
    <Card className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-all hover:shadow-sm">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9">
              <AvatarImage src={request.employeeAvatar} alt={request.employeeName} />
              <AvatarFallback className="text-[10px] font-bold">
                {request.employeeName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{request.employeeName}</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">{request.department}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[9px] font-bold tracking-wider uppercase border ${getPriorityClass(request.priority)}`}>
            {request.priority}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            {getRequestBadge(request.requestType)}
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Submitted: {request.submittedDate}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {request.details}
          </p>

          {request.leaveDates && (
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-2 flex items-center justify-between text-[11px] font-semibold border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Dates: {request.leaveDates.startDate} <ArrowRight className="inline h-3 w-3 mx-1" /> {request.leaveDates.endDate}</span>
              <Badge variant="secondary" className="text-[10px] font-bold bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                {request.leaveDates.totalDays} days
              </Badge>
            </div>
          )}

          {request.correctionDetails && (
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-2 text-[11px] space-y-1 font-semibold border border-slate-100 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">Date: {request.correctionDetails.date}</p>
              <div className="flex gap-2.5 text-[10px] text-muted-foreground">
                <span>In: {request.correctionDetails.actualTimeIn}</span>
                <span>Out: {request.correctionDetails.actualTimeOut}</span>
              </div>
            </div>
          )}

          {request.overtimeHours && (
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-2 flex justify-between items-center text-[11px] font-semibold border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Requested Overtime:</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-none font-bold">
                {request.overtimeHours} hours
              </Badge>
            </div>
          )}
        </div>

        {request.status === 'Pending' ? (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-slate-100 dark:border-slate-800 text-[11px] font-bold"
              onClick={() => onReject(request.id)}
            >
              <X className="mr-1 h-3.5 w-3.5" /> Deny
            </Button>
            <Button 
              size="sm" 
              className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold border-none"
              onClick={() => onApprove(request.id)}
            >
              <Check className="mr-1 h-3.5 w-3.5" /> Approve
            </Button>
          </div>
        ) : (
          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800/60">
            <Badge 
              variant="outline" 
              className={
                request.status === 'Approved' 
                  ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5' 
                  : 'border-rose-500/30 text-rose-600 bg-rose-50/5'
              }
            >
              Resolved: {request.status}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}