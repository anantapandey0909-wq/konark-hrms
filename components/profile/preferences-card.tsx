'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Languages, 
  Clock, 
  Mail, 
  BellRing, 
  SmartphoneNfc 
} from 'lucide-react';

interface PreferencesCardProps {
  profile: UserProfile;
}

export default function PreferencesCard({ profile }: PreferencesCardProps) {
  const mockChannels = [
    { label: 'E-mail notifications', active: profile.preferences.notifications.email, icon: Mail },
    { label: 'Desktop Push notifications', active: profile.preferences.notifications.push, icon: BellRing },
    { label: 'Direct SMS notifications', active: profile.preferences.notifications.sms, icon: SmartphoneNfc },
    { label: 'Weekly Ingestion Digest', active: profile.preferences.notifications.weeklyDigest, icon: Settings }
  ];

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-850/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Settings className="h-4.5 w-4.5" />
          </div>
          <div>
            <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              System Preferences
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-500">
          <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
            <span className="flex items-center gap-1.5">
              <Languages className="h-4 w-4" />
              Primary System Language
            </span>
            <span className="font-bold text-zinc-800 dark:text-zinc-100 font-mono">
              {profile.preferences.language}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Company Timezone
            </span>
            <span className="font-bold text-zinc-800 dark:text-zinc-100 font-mono text-[10px]">
              {profile.preferences.timeZone}
            </span>
          </div>
        </div>

        {/* Channels Notification Toggle Mock Block */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">
            System Communication Channels
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {mockChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/40"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 leading-normal">{channel.label}</span>
                  </div>

                  {/* Toggle representation visual only */}
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${channel.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`}>
                      {channel.active ? 'Active' : 'Muted'}
                    </span>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 cursor-default ${channel.active ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-zinc-200 dark:bg-zinc-850'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${channel.active ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}