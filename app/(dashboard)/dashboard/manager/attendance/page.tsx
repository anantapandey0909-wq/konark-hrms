import Link from "next/link";
import { Metadata } from "next";
import { CalendarRange, ArrowLeft, AlertTriangle, ShieldCheck } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceOverview } from "@/components/manager-portal/attendance-overview";
import { mockAttendanceSummary, mockTeamMembers } from "@/mock/manager-portal";

export const metadata: Metadata = {
  title: "Team Attendance — Konark HRMS",
  description: "Audit shift schedules, punctuality rates and late check-in reports.",
};

export default function AttendanceDashboardPage() {
  const lateMembers = mockTeamMembers.filter((m) => m.status === "Late");
  const absentMembers = mockTeamMembers.filter((m) => m.status === "Absent");

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs font-bold text-muted-foreground hover:text-slate-900"
          asChild
        >
          <Link href="/dashboard/manager">
            <ArrowLeft className="h-4 w-4" /> Back to Workspace
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarRange className="h-7 w-7 text-indigo-500" />
            <span>Attendance Diagnostics</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Monitor real-time office log-ins, remote parameters, and daily schedule variance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AttendanceOverview summary={mockAttendanceSummary} />
        </div>

        <div className="space-y-6">
          {/* Late Checkins Detail */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Today&apos;s Late Arrivals</span>
              </CardTitle>
              <CardDescription className="text-xs">Logged check-ins beyond designated shift times</CardDescription>
            </CardHeader>
            <CardContent>
              {lateMembers.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No late check-ins recorded today.</p>
              ) : (
                <div className="space-y-3">
                  {lateMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-xs font-bold">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.designation}</p>
                      </div>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400">In: {m.checkInTime}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Absent Detail */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-rose-500" />
                <span>Absent / Unscheduled</span>
              </CardTitle>
              <CardDescription className="text-xs">No activity signatures logged for today</CardDescription>
            </CardHeader>
            <CardContent>
              {absentMembers.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">All team members accounted for.</p>
              ) : (
                <div className="space-y-3">
                  {absentMembers.map((m) => (
                    <div key={m.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-bold">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{m.designation}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}