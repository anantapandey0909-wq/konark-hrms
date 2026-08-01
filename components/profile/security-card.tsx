'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import { formatDateTime } from '@/lib/data-management/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Fingerprint, 
  Smartphone, 
  History, 
  Terminal
} from 'lucide-react';

interface SecurityCardProps {
  profile: UserProfile;
}

export default function SecurityCard({ profile }: SecurityCardProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-850/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              Security Operations
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-zinc-500">
          <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 flex flex-col justify-between space-y-3">
            <div className="flex items-center space-x-2">
              <Fingerprint className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide text-[10px]">Credential Health</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Credential Last Changed</p>
              <p className="text-[11.5px] font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                {formatDateTime(profile.security.passwordLastChanged)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide text-[10px] flex items-center gap-2">
                <Smartphone className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                2FA Status
              </span>
              <Badge variant="outline" className="text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 border bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40">
                Enabled
              </Badge>
            </div>
            <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 leading-normal">
              Two-factor credentials verify authorization levels securely during platform sessions.
            </p>
          </div>
        </div>

        {/* Dynamic Log History Summary */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-2">
            <History className="h-4.5 w-4.5 text-zinc-455" />
            <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-455">Active Authorization History</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-150 dark:border-zinc-800/80">
            <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-800/80 text-[11px] text-left">
              <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 font-bold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 font-mono">Device / Platform</th>
                  <th className="px-4 py-2 text-center">IP Address</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-zinc-650 dark:text-zinc-350">
                {profile.loginHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-zinc-850 dark:text-zinc-100">{log.device}</td>
                    <td className="px-4 py-3 text-center font-mono">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-center font-mono">{formatDateTime(log.timestamp).split(',')[0]}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        log.status === 'successful'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                          : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}