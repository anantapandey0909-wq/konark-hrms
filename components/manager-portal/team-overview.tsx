"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/types/manager-portal';
import { Users2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface TeamOverviewProps {
  readonly team: readonly TeamMember[];
}

export function TeamOverview({ team }: TeamOverviewProps) {
  const statusCounts = team.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<TeamMember['status'], number>);

  const statuses: readonly { label: TeamMember['status']; color: string; count: number }[] = [
    { label: 'Present', color: 'bg-emerald-500 text-white dark:bg-emerald-600', count: statusCounts['Present'] || 0 },
    { label: 'Remote', color: 'bg-blue-500 text-white dark:bg-blue-600', count: statusCounts['Remote'] || 0 },
    { label: 'Late', color: 'bg-amber-500 text-white dark:bg-amber-600', count: statusCounts['Late'] || 0 },
    { label: 'Absent', color: 'bg-slate-400 text-white dark:bg-slate-600', count: statusCounts['Absent'] || 0 },
    { label: 'On Leave', color: 'bg-rose-500 text-white dark:bg-rose-600', count: statusCounts['On Leave'] || 0 },
  ];

  const newJoiners = team.filter(m => m.isNewJoiner);

  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Users2 className="h-4 w-4 text-indigo-500" />
            <span>Team Status Overview</span>
          </CardTitle>
          <CardDescription className="text-xs">Realtime workplace categorization of reports</CardDescription>
        </div>
        <Link 
          href="/dashboard/manager/team" 
          className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5 dark:text-indigo-400"
        >
          Manage Team <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {statuses.map((item) => (
            <div 
              key={item.label} 
              className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-between"
            >
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">{item.label}</span>
              <span className="text-lg font-bold mt-1 text-slate-800 dark:text-slate-100">{item.count}</span>
            </div>
          ))}
        </div>

        {newJoiners.length > 0 && (
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
            <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
              New Team Joiners ({newJoiners.length})
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {newJoiners.map((m) => (
                <Badge key={m.id} variant="secondary" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
                  {m.name} — {m.designation}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}