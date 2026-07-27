"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Announcement } from "@/types/employee-portal";
import { Volume2, ExternalLink } from "lucide-react";

interface AnnouncementsProps {
  readonly announcements: readonly Announcement[];
}

export function Announcements({ announcements }: AnnouncementsProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const getCategoryColor = (category: Announcement["category"]) => {
    switch (category) {
      case "POLICY":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40";
      case "EVENT":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/40";
      case "SYSTEM":
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
            Company Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">No active announcements.</p>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col gap-2 rounded-lg border border-slate-100 p-3 hover:border-slate-200 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`${getCategoryColor(item.category)} text-[10px] tracking-wide uppercase`}>
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-50 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.summary}
                  </p>
                </div>
                <div className="mt-1 text-right">
                  <Button
                    onClick={() => setSelectedAnnouncement(item)}
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                  >
                    Read Details
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={selectedAnnouncement !== null} onOpenChange={(open) => { if (!open) setSelectedAnnouncement(null); }}>
        {selectedAnnouncement && (
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-indigo-500" />
                <span className="text-xs text-slate-400">Published by {selectedAnnouncement.author}</span>
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {selectedAnnouncement.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Published on {new Date(selectedAnnouncement.publishedAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedAnnouncement.content}
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedAnnouncement(null)} variant="secondary">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}