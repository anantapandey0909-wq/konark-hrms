"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UpcomingEvent } from '@/types/manager-portal';
import { sortUpcomingEvents } from '@/lib/manager/utils';
import { Calendar, Cake, Award, Users, GraduationCap } from 'lucide-react';

interface UpcomingEventsProps {
  readonly events: readonly UpcomingEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const sorted = sortUpcomingEvents(events);

  const getIcon = (type: UpcomingEvent['type']) => {
    switch (type) {
      case 'Birthday':
        return <Cake className="h-4 w-4 text-pink-500" />;
      case 'Anniversary':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'Meeting':
        return <Users className="h-4 w-4 text-indigo-500" />;
      case 'Training':
        return <GraduationCap className="h-4 w-4 text-cyan-500" />;
      default:
        return <Calendar className="h-4 w-4 text-slate-400" />;
    }
  };

  const getBgClass = (type: UpcomingEvent['type']) => {
    switch (type) {
      case 'Birthday':
        return 'bg-pink-500/10 border-pink-500/20';
      case 'Anniversary':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'Meeting':
        return 'bg-indigo-500/10 border-indigo-500/20';
      case 'Training':
        return 'bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <span>Upcoming Events</span>
        </CardTitle>
        <CardDescription className="text-xs">Birthdays, milestones and scheduling milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3.5">
          {sorted.map((evt) => (
            <div 
              key={evt.id} 
              className="flex items-start gap-3 p-2 rounded-xl border border-slate-100/30 dark:border-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <div className={`p-2 rounded-xl border shrink-0 ${getBgClass(evt.type)}`}>
                {getIcon(evt.type)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold leading-normal text-slate-800 dark:text-slate-100">{evt.title}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  <span>{evt.date}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal font-medium">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}