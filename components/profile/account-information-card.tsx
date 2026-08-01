'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import { formatDateTime } from '@/lib/data-management/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Key, 
  Network, 
  Workflow, 
  Calendar, 
  Clock 
} from 'lucide-react';

interface AccountInformationCardProps {
  profile: UserProfile;
}

export default function AccountInformationCard({ profile }: AccountInformationCardProps) {
  const metaFields = [
    { label: 'Employee ID', value: profile.employeeId, icon: Key, fontMono: true },
    { label: 'System Username', value: profile.username, icon: Key, fontMono: true },
    { label: 'Primary Department', value: profile.department, icon: Network },
    { label: 'Job Designation', value: profile.designation, icon: Workflow },
    { label: 'Authorized Role', value: profile.role, icon: Workflow },
    { label: 'Employment Type', value: profile.employmentType.replace('_', ' '), icon: Building2, capitalize: true },
    { label: 'Onboarding Date', value: profile.joiningDate, icon: Calendar },
    { label: 'Reporting Manager', value: profile.reportingManager, icon: Workflow }
  ];

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-850/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Building2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              Corporate Register Account Info
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {metaFields.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div 
              key={idx} 
              className="flex justify-between items-center text-xs py-2 border-b border-dashed border-zinc-150 dark:border-zinc-800/60"
            >
              <span className="text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </span>
              <span className={`font-bold text-zinc-800 dark:text-zinc-100 ${f.fontMono ? 'font-mono' : ''} ${f.capitalize ? 'capitalize' : ''}`}>
                {f.value}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}