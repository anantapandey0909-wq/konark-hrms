"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper, Info } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
}

interface AnnouncementBoardProps {
  readonly announcements: readonly Announcement[];
}

export function AnnouncementBoard({ announcements }: AnnouncementBoardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-slate-400" />
          Announcements Board
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ScrollArea className="h-[260px] pr-3">
          <div className="space-y-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-100 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>By {item.author}</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}