"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn, LogOut, CalendarPlus, FileText, Landmark } from "lucide-react";
import { AttendanceSummary } from "@/types/employee-portal";

interface QuickActionsProps {
  readonly initialAttendance: AttendanceSummary;
}

export function QuickActions({ initialAttendance }: QuickActionsProps) {
  const [attendance, setAttendance] = useState<AttendanceSummary>(initialAttendance);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePunchToggle = () => {
    setLoading(true);
    setTimeout(() => {
      setAttendance((prev) => {
        const nextState = !prev.clockedIn;
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        
        if (nextState) {
          toast.success("Punch-In Successful", {
            description: `Clocked in today at ${now}. Have a great working day!`,
          });
          return {
            ...prev,
            clockedIn: true,
            todayFirstPunch: now,
          };
        } else {
          toast.success("Punch-Out Successful", {
            description: `Clocked out today at ${now}. Remember to sign timesheets.`,
          });
          return {
            ...prev,
            clockedIn: false,
            todayLastPunch: now,
          };
        }
      });
      setLoading(false);
    }, 1000);
  };

  const handleRequestLeave = () => {
    toast.info("Leave Request", {
      description: "Directing request workflow structure. Leave Application available in next updates.",
    });
  };

  const handleViewPayslip = () => {
    toast.info("Payslips", {
      description: "Historical salary records and compilation modules will be available shortly.",
    });
  };

  const handleHRQuery = () => {
    toast.info("HR Support System", {
      description: "Support desk integration and ticket submission modules are being finalized.",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1">
        <Button
          onClick={handlePunchToggle}
          disabled={loading}
          variant={attendance.clockedIn ? "destructive" : "default"}
          className="flex items-center gap-2"
          aria-label={attendance.clockedIn ? "Punch out current session" : "Punch in new session"}
        >
          {attendance.clockedIn ? (
            <>
              <LogOut className="h-4 w-4" />
              Clock Out
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Clock In
            </>
          )}
        </Button>

        <Button
          onClick={handleRequestLeave}
          variant="outline"
          className="flex items-center gap-2"
          aria-label="Request dynamic leaves"
        >
          <CalendarPlus className="h-4 w-4" />
          Request Leave
        </Button>

        <Button
          onClick={handleViewPayslip}
          variant="outline"
          className="flex items-center gap-2"
          aria-label="Access structural payslips"
        >
          <Landmark className="h-4 w-4" />
          My Payslips
        </Button>

        <Button
          onClick={handleHRQuery}
          variant="outline"
          className="flex items-center gap-2"
          aria-label="Create query or assistance ticket"
        >
          <FileText className="h-4 w-4" />
          Raise Ticket
        </Button>
      </CardContent>
    </Card>
  );
}