"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ShieldCheck, Briefcase } from "lucide-react";

interface ProfileHeaderProps {
  readonly name: string;
  readonly designation: string;
  readonly department: string;
  readonly workLocation: string;
  readonly status: "ACTIVE" | "PROBATION" | "SUSPENDED";
}

export function ProfileHeader({
  name,
  designation,
  department,
  workLocation,
  status,
}: ProfileHeaderProps) {
  const initials = name
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .toUpperCase();

  const getStatusColor = (statusVal: typeof status) => {
    switch (statusVal) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
      case "PROBATION":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800";
    }
  };

  return (
    <Card className="border-none bg-slate-900 text-white shadow-md dark:bg-slate-950">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <Avatar className="h-16 w-16 border-2 border-slate-700 md:h-20 md:w-20">
              <AvatarFallback className="bg-slate-800 text-lg font-bold text-slate-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                  {name}
                </h1>
                <Badge variant="outline" className={`${getStatusColor(status)} text-[10px] tracking-wide uppercase`}>
                  {status}
                </Badge>
              </div>
              <p className="text-sm text-slate-300">{designation}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  {department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {workLocation}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-800/20 px-4 py-2.5 md:self-center">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Security / KYC</div>
              <div className="text-xs font-semibold text-slate-200">Fully Verified Profile</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}