"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CalendarRange, 
  FileCheck, 
  Sparkles, 
  FolderDown, 
  CalendarDays 
} from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const items = [
    { label: "Approve Leave", icon: FileCheck, color: "text-indigo-500 bg-indigo-500/5", href: "/dashboard/manager/approvals" },
    { label: "View Team", icon: Users, color: "text-emerald-500 bg-emerald-500/5", href: "/dashboard/manager/team" },
    { label: "Attendance Report", icon: CalendarRange, color: "text-rose-500 bg-rose-500/5", href: "/dashboard/manager/attendance" },
    { label: "Performance Reviews", icon: Sparkles, color: "text-amber-500 bg-amber-500/5", href: "/dashboard/manager/performance" },
    { label: "Generate Report", icon: FolderDown, color: "text-purple-500 bg-purple-500/5", href: "/dashboard/manager/reports" },
    { label: "Company Calendar", icon: CalendarDays, color: "text-blue-500 bg-blue-500/5", href: "/dashboard/manager/attendance" }
  ];

  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
        <CardDescription className="text-xs">Rapid workspace shortcuts for managers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {items.map((act) => {
            const Icon = act.icon;
            return (
            <Link
  key={act.label}
  href={act.href}
>
  <Button
    variant="outline"
    className="h-auto py-3 px-2 flex flex-col items-center justify-center gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all w-full"
  >
    <Icon className="h-5 w-5" />
    <span className="text-xs font-medium">
      {act.label}
    </span>
  </Button>
</Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}