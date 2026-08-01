"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ManagerAnnouncement } from '@/types/manager-portal';
import { Megaphone, AlertCircle, FileText } from 'lucide-react';

interface AnnouncementsProps {
  readonly announcements: readonly ManagerAnnouncement[];
}

export function Announcements({ announcements }: AnnouncementsProps) {
  const getCategoryClass = (cat: ManagerAnnouncement['category']) => {
    switch (cat) {
      case 'Policy Update':
        return 'border-amber-500/20 text-amber-600 bg-amber-500/5';
      case 'HR Notification':
        return 'border-pink-500/20 text-pink-600 bg-pink-500/5';
      default:
        return 'border-indigo-500/20 text-indigo-600 bg-indigo-500/5';
    }
  };

  return (
    <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-indigo-500" />
          <span>Announcements</span>
        </CardTitle>
        <CardDescription className="text-xs">Direct communications and corporate briefs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {announcements.map((ann) => (
            <div 
              key={ann.id} 
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2.5 relative"
            >
              {ann.isImportant && (
                <span className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[9px] font-bold uppercase ${getCategoryClass(ann.category)}`}>
                  {ann.category}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-semibold">{ann.date}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold leading-normal text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  {ann.isImportant && <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
                  {ann.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-medium">
                  {ann.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}