"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Clock, 
  Play, 
  Square, 
  Calendar, 
  Timer, 
  MapPin, 
  CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AttendanceState = "NOT_CLOCKED_IN" | "CLOCKED_IN" | "CLOCKED_OUT";

// Helper formats dynamic elapsed seconds into a standard HH:MM:SS format
const formatWorkedHours = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number): string => String(num).padStart(2, "0");
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

// Reusable time formatting helper with strict local configuration options
const formatTime = (date: Date | null, includeSeconds = false): string => {
  if (!date) return "--:--";
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: true,
  });
};

export default function ClockInCard() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [status, setStatus] = useState<AttendanceState>("NOT_CLOCKED_IN");
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [workedSeconds, setWorkedSeconds] = useState<number>(0);

  const workTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Prevent hydration mismatches by ensuring wall clock runs only on client mount
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // Track dynamic work hours calculation when status is active
  useEffect(() => {
    if (status === "CLOCKED_IN") {
      workTimerRef.current = setInterval(() => {
        setWorkedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (workTimerRef.current) {
        clearInterval(workTimerRef.current);
        workTimerRef.current = null;
      }
    }

    return () => {
      if (workTimerRef.current) {
        clearInterval(workTimerRef.current);
        workTimerRef.current = null;
      }
    };
  }, [status]);

  const handleClockIn = (): void => {
    const now = new Date();
    setClockInTime(now);
    setStatus("CLOCKED_IN");
    setWorkedSeconds(0);
  };

  const handleClockOut = (): void => {
    const now = new Date();
    setClockOutTime(now);
    setStatus("CLOCKED_OUT");
  };

  // Safe system state placeholder while mounting
  if (!mounted || !currentTime) {
    return (
      <Card className="border border-border bg-card text-card-foreground shadow-sm">
        <CardContent className="h-64 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <Clock className="animate-spin h-4 w-4" />
            <span>Loading interface...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="border border-border bg-card text-card-foreground shadow-sm overflow-hidden h-full">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Attendance Console
            </CardTitle>
            <CardDescription className="text-xs">
              Manage your daily schedule and track shift periods
            </CardDescription>
          </div>
          <Badge
            variant={
              status === "CLOCKED_IN"
                ? "default"
                : status === "CLOCKED_OUT"
                ? "secondary"
                : "outline"
            }
            className={`w-fit font-medium text-xs py-0.5 px-2.5 shrink-0 ${
              status === "CLOCKED_IN"
                ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-500/20"
                : status === "CLOCKED_OUT"
                ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                : "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 border-amber-200 dark:border-amber-900/30"
            }`}
          >
            {status === "CLOCKED_IN" && "Currently Working"}
            {status === "CLOCKED_OUT" && "Shift Completed"}
            {status === "NOT_CLOCKED_IN" && "Not Clocked In"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Wall Clock and Current Calendar Period */}
        <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/30 border border-border/40">
          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground font-medium mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight tabular-nums font-mono text-foreground">
            {formatTime(currentTime, true)}
          </div>
          <div className="flex items-center space-x-1 mt-1.5 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3 text-emerald-500" />
            <span>Workplace location: Main Office</span>
          </div>
        </div>

        {/* Shift Details Matrix */}
        <div className="grid grid-cols-2 gap-4 text-xs">
  <div className="space-y-1">
    <span className="text-muted-foreground">Shift Timing</span>
    <p className="font-semibold text-foreground">
      09:00 AM – 06:00 PM
    </p>
  </div>

  <div className="space-y-1 text-right">
    <span className="text-muted-foreground">Today's Attendance</span>

    <Badge
      variant={
        status === "CLOCKED_IN"
          ? "default"
          : status === "CLOCKED_OUT"
          ? "secondary"
          : "outline"
      }
      className="mt-1"
    >
      {status === "CLOCKED_IN" && "Present"}
      {status === "CLOCKED_OUT" && "Completed"}
      {status === "NOT_CLOCKED_IN" && "Not Marked"}
    </Badge>
  </div>

  <div className="space-y-1">
    <span className="text-muted-foreground">Worked Hours Today</span>

    <div className="flex items-center gap-1 font-semibold text-foreground">
      <Timer className="h-3.5 w-3.5 text-muted-foreground" />

      <span className="tabular-nums font-mono">
        {formatWorkedHours(workedSeconds)}
      </span>
    </div>
  </div>

  <div className="space-y-1 text-right">
    <span className="text-muted-foreground">Last Clock In</span>

    <p className="font-semibold text-foreground">
      {formatTime(clockInTime)}
    </p>
  </div>

  <div className="space-y-1">
    <span className="text-muted-foreground">Last Clock Out</span>

    <p className="font-semibold text-foreground">
      {formatTime(clockOutTime)}
    </p>
  </div>

  <div className="space-y-1 text-right">
    <span className="text-muted-foreground">Location</span>

    <p className="font-semibold text-foreground">
      Main Office
    </p>
  </div>
</div>

        {/* Dynamic Action Buttons */}
        <div className="pt-2">
          {status === "NOT_CLOCKED_IN" && (
            <Button
              onClick={handleClockIn}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white shadow-sm font-medium h-10 transition-all"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Clock In</span>
            </Button>
          )}

          {status === "CLOCKED_IN" && (
            <Button
              onClick={handleClockOut}
              variant="destructive"
              className="w-full flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-white shadow-sm font-medium h-10 transition-all"
            >
              <Square className="h-4 w-4 fill-current" />
              <span>Clock Out</span>
            </Button>
          )}

          {status === "CLOCKED_OUT" && (
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-center space-y-1">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-xs font-semibold">Shift records successfully finalized for today</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}