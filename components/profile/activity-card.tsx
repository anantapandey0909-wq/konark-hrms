'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import { formatRelativeTime } from '@/lib/data-management/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Activity, 
  User, 
  Settings, 
  ShieldCheck, 
  KeyRound,
  History
} from 'lucide-react';

interface ActivityCardProps {
  profile: UserProfile;
}

const TYPE_ICONS = {
  profile_change: User,
  security_update: ShieldCheck,
  preference_change: Settings,
  login: KeyRound,
};

export default function ActivityCard({ profile }: ActivityCardProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-850/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <History className="h-4.5 w-4.5" />
          </div>
          <div>
            <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              Audit Operations Timeline
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {profile.activities.map((act, idx) => {
            const Icon = TYPE_ICONS[act.type] || Activity;
            return (
              <div key={act.id} className="flex gap-3 relative">
                {idx < profile.activities.length - 1 && (
                  <div className="absolute top-8 left-4 w-[2px] h-[calc(100%-1rem)] bg-zinc-150 dark:bg-zinc-800/80 -z-10" />
                )}
                
                <div className="p-2 rounded-lg border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-300 shrink-0 h-8.5 w-8.5 flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                      {act.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                    {act.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}