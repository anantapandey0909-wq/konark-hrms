"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, User, Phone, Mail, Link2 } from "lucide-react";

interface EmergencyContactData {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface EmergencyContactProps {
  readonly data: EmergencyContactData;
}

export function EmergencyContact({ data }: EmergencyContactProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <HeartHandshake className="h-4 w-4 text-slate-400" />
          Emergency Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">Contact Person</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {data.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link2 className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">Relationship</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {data.relationship}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">Phone Number</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {data.phone}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">Email Address</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 break-all">
              {data.email}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}