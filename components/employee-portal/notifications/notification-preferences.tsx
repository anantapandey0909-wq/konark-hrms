"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sliders, BellRing, MailCheck, MessageSquareCode } from "lucide-react";
import { toast } from "sonner";

export function NotificationPreferences() {
  const handlePreferenceChange = (channel: string, active: boolean) => {
    toast.success("Preferences updated", {
      description: `${channel} alert configs successfully configured (UI simulation).`,
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Sliders className="h-4 w-4 text-slate-400" />
          Alert Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <MailCheck className="h-4.5 w-4.5 text-slate-400" />
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Email Digests
              </h4>
              <p className="text-[10px] text-slate-400">Leaves, timesheets & approvals</p>
            </div>
          </div>
          <Switch
            defaultChecked
            onCheckedChange={(val) => handlePreferenceChange("Email Digest", val)}
            aria-label="Toggle email notifications digest"
          />
        </div>

        <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <BellRing className="h-4.5 w-4.5 text-slate-400" />
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Web App Push
              </h4>
              <p className="text-[10px] text-slate-400">Direct real-time desktop flashes</p>
            </div>
          </div>
          <Switch
            defaultChecked
            onCheckedChange={(val) => handlePreferenceChange("Web Push", val)}
            aria-label="Toggle Web App Push notifications"
          />
        </div>

        <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <MessageSquareCode className="h-4.5 w-4.5 text-slate-400" />
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Slack Integrations
              </h4>
              <p className="text-[10px] text-slate-400">Direct workspace notifications</p>
            </div>
          </div>
          <Switch
            onCheckedChange={(val) => handlePreferenceChange("Slack Sync", val)}
            aria-label="Toggle Slack instant integration triggers"
          />
        </div>
      </CardContent>
    </Card>
  );
}