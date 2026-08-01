"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

import { EmployeeProfile } from "@/types/employee-portal";

interface WelcomeHeaderProps {
  readonly profile: EmployeeProfile;
}

export function WelcomeHeader({
  profile,
}: WelcomeHeaderProps) {
  // Initialize with the current time instead of setting it in useEffect
  const [time, setTime] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const greeting = React.useMemo(() => {
    const hours = time.getHours();

    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  }, [time]);

  const formattedTime = React.useMemo(
    () =>
      time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [time]
  );

  const formattedDate = React.useMemo(
    () =>
      time.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [time]
  );

  const initials = React.useMemo(
    () =>
      profile.name
        .split(" ")
        .map((chunk) => chunk[0])
        .join("")
        .toUpperCase(),
    [profile.name]
  );

  return (
    <Card className="border-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <Avatar className="h-16 w-16 border-2 border-slate-700 md:h-20 md:w-20">
              <AvatarImage
                src={profile.avatarUrl}
                alt={profile.name}
              />
              <AvatarFallback className="bg-slate-700 text-lg font-bold text-slate-100">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Employee Dashboard
              </span>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {greeting}, {profile.name}
              </h1>

              <p className="text-sm text-slate-300">
                {profile.designation} &bull; {profile.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/40 px-4 py-3 md:self-center">
            <Clock className="h-5 w-5 text-slate-400" />

            <div className="space-y-0.5 text-right">
              <div className="font-mono text-lg font-bold tracking-tight md:text-xl">
                {formattedTime}
              </div>

              <div className="whitespace-nowrap text-xs text-slate-400">
                {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}