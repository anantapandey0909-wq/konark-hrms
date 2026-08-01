"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getGreetingByTime } from '@/lib/manager/utils';
import { ManagerProfile } from '@/types/manager-portal';
import { Users, Calendar } from 'lucide-react';

interface WelcomeHeaderProps {
  readonly profile: ManagerProfile;
}

export function WelcomeHeader({ profile }: WelcomeHeaderProps) {
  const greeting = getGreetingByTime();
  const dateString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Users className="h-44 w-44 text-indigo-400" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-indigo-500/50 shadow-md">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-slate-800 text-white font-bold">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {greeting}, {profile.name.split(' ')[0]}
              </h1>
              <Badge variant="outline" className="border-indigo-500/40 text-indigo-300 bg-indigo-500/10 uppercase tracking-wider text-[10px] font-semibold py-0.5">
                Manager Portal
              </Badge>
            </div>
            <p className="text-slate-300 mt-1.5 text-sm flex items-center gap-2 font-medium">
              <span>{profile.designation}</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-300 font-semibold">{profile.department}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3.5">
            <Users className="h-4 w-4 text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Supervising</p>
              <p className="text-xs font-semibold text-slate-200">{profile.teamSize} Team Members</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3.5">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Date</p>
              <p className="text-xs font-semibold text-slate-200">{dateString}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}