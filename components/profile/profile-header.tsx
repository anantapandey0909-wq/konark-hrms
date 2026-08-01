'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import { formatDateTime } from '@/lib/data-management/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, ShieldAlert, KeyRound } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export default function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    suspended: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
    on_leave: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  };

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Circle */}
            <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center border border-indigo-200 dark:border-indigo-900 shrink-0">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={`${profile.firstName} ${profile.lastName}`} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 font-mono tracking-wider">
                  {getInitials(profile.firstName, profile.lastName)}
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {profile.firstName} {profile.lastName}
                </h1>
                <Badge variant="outline" className={`capitalize border text-[10px] py-0.5 px-2 font-bold tracking-wide self-center ${statusColors[profile.accountStatus]}`}>
                  {profile.accountStatus.replace('_', ' ')}
                </Badge>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {profile.designation} • {profile.department}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[10.5px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span>ID: {profile.employeeId}</span>
                <span>•</span>
                <span>{profile.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-sans">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Last Login:{" "}
{profile.lastLogin
  ? formatDateTime(profile.lastLogin)
  : "Never"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-center md:self-auto shrink-0">
            <Button
              onClick={onEditClick}
              size="sm"
              variant="outline"
              className="h-9 text-xs border-zinc-250 dark:border-zinc-750 inline-flex items-center gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5 text-zinc-500" />
              <span>Edit Account Profile</span>
            </Button>
            <Button
              disabled
              size="sm"
              variant="outline"
              className="h-9 text-xs border-zinc-250 dark:border-zinc-750 inline-flex items-center gap-1.5 cursor-not-allowed"
            >
              <KeyRound className="h-3.5 w-3.5 text-zinc-500" />
              <span>Change Password</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}