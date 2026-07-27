"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Cake, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";

interface CelebrationItem {
  id: string;
  name: string;
  type: "BIRTHDAY" | "ANNIVERSARY";
  date: string;
  department: string;
  years?: number;
}

interface BirthdaysAnniversariesProps {
  readonly celebrations: readonly CelebrationItem[];
}

export function BirthdaysAnniversaries({ celebrations }: BirthdaysAnniversariesProps) {
  const handleSendWish = (name: string, type: string) => {
    toast.success("Message Queued", {
      description: `Your custom greeting for ${name}'s ${type.toLowerCase()} has been sent.`,
    });
  };

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Gift className="h-4 w-4 text-slate-400" />
          Celebrations Board
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {celebrations.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-slate-850"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-rose-50 p-2 dark:bg-rose-950/20">
                {person.type === "BIRTHDAY" ? (
                  <Cake className="h-4 w-4 text-rose-500" />
                ) : (
                  <Sparkles className="h-4 w-4 text-rose-500" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {person.name}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {person.type === "BIRTHDAY" ? "Birthday" : `${person.years}Y Anniversary`} &bull; {getFormattedDate(person.date)}
                </p>
              </div>
            </div>

            <div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-rose-500"
                onClick={() => handleSendWish(person.name, person.type)}
                title="Send Greeting"
                aria-label={`Send custom celebration greeting to ${person.name}`}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}