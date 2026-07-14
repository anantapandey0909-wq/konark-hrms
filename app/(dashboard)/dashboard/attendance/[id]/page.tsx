import Link from "next/link";
import { 
  ChevronLeft, 
  Edit, 
  Clock, 
  MapPin,
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockAttendanceRecords } from "@/mock/attendance";
import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Local formatting helpers to prevent redundant formatting logic
const formatDate = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (isoString: string | null): string => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatHours = (hours: number | null): string => {
  if (hours === null || hours === undefined) return "--";
  return `${hours.toFixed(1)} hrs`;
};

export default async function AttendanceDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const record = mockAttendanceRecords.find((r) => r.id === id);

  // Fallback if record lookup is invalid
  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-neutral-50/40 dark:bg-neutral-950/20">
        <Card className="w-full max-w-md border border-border bg-card shadow-sm text-center">
          <CardHeader className="pt-8 pb-4 flex flex-col items-center">
            <div className="p-3 rounded-full bg-destructive/10 dark:bg-destructive/20 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Attendance Record Not Found
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              The attendance record you are looking for does not exist or has been removed from the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 pt-2">
            <Link
              href="/dashboard/attendance"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-10 text-sm font-medium"
              )}
            >
              Return to Attendance
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Refined metadata properties
  const shiftName = record.shiftName ?? "General Shift";
  const regularizationStatus = record.isRegularized ? "Regularized" : "Not Regularized";

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-64px)] bg-neutral-50/40 dark:bg-neutral-950/20">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col gap-4">
        <div>
          <Link
            href="/dashboard/attendance"
            className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-all gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Attendance Details
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-foreground">{record.employeeName}</span>
              <span className="text-xs font-mono text-muted-foreground">({record.employeeCode})</span>
              <span className="text-muted-foreground/50 text-xs">•</span>
              <span className="text-xs font-medium text-muted-foreground">{formatDate(record.date)}</span>
              <span className="text-muted-foreground/50 text-xs">•</span>
              <AttendanceStatusBadge status={record.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/attendance/${record.id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 gap-1.5 text-xs font-medium")}
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Record
            </Link>
          </div>
        </div>
      </div>

      {/* Reusable Card Elements Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* Core Timesheet Details (Left 2-Column Block) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Information Card */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Employee Information</CardTitle>
              <CardDescription className="text-xs">Organizational assignment and profile data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Employee Name</span>
                  <span className="text-sm font-medium text-foreground">{record.employeeName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Employee ID</span>
                  <span className="text-sm font-mono font-medium text-foreground">{record.employeeCode}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Department</span>
                  <span className="text-sm font-medium text-foreground">{record.department}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Attendance Date</span>
                  <span className="text-sm font-medium text-foreground">{formatDate(record.date)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Information Card */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Attendance Information</CardTitle>
              <CardDescription className="text-xs">Time tracking metrics and location details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Clock In</span>
                  <span className="text-sm font-medium text-foreground">{formatTime(record.clockInAt)}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Clock Out</span>
                  <span className="text-sm font-medium text-foreground">{formatTime(record.clockOutAt)}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Work Hours</span>
                  <span className="text-sm font-semibold text-foreground">{formatHours(record.workHours)}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Overtime</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {record.overtimeHours && record.overtimeHours > 0 ? `+${record.overtimeHours.toFixed(1)} hrs` : "--"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Assigned Shift</span>
                  <span className="text-sm font-medium text-foreground">{shiftName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Location</span>
                  <span className="text-sm font-medium text-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {record.location ?? "--"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Activity Timeline Card */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Attendance Timeline</CardTitle>
              <CardDescription className="text-xs">Chronological sequence of tracked work logs</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="relative pl-6 border-l border-border/80 space-y-6 ml-3">
                {/* Clock In Point */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 bg-background border-2 border-primary rounded-full p-1 z-10">
                    <Clock className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Clock In Logged</span>
                    <span className="text-xs text-muted-foreground">{formatTime(record.clockInAt)}</span>
                    {record.clockInAt && (
                      <span className="text-[10px] text-muted-foreground/80 mt-0.5">
                        Employee Checked In
                      </span>
                    )}
                  </div>
                </div>

                {/* Duration Tracking Midpoint */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 bg-background border-2 border-border rounded-full p-1 z-10">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground/35" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Working Duration</span>
                    <span className="text-xs text-muted-foreground">Session calculated runtime: {formatHours(record.workHours)}</span>
                  </div>
                </div>

                {/* Clock Out Point */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 bg-background border-2 border-muted-foreground rounded-full p-1 z-10">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Clock Out Logged</span>
                    <span className="text-xs text-muted-foreground">{formatTime(record.clockOutAt)}</span>
                    {record.clockOutAt ? (
                      <span className="text-[10px] text-muted-foreground/80 mt-0.5">
                        Employee Checked Out
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                        No terminal transaction logged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Metadata & Status details (Right Sidebar Column) */}
        <div className="lg:col-span-1">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Attendance Summary</CardTitle>
              <CardDescription className="text-xs">Compliance metrics and administrative comments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1.5">Attendance Status</span>
                <AttendanceStatusBadge status={record.status} />
              </div>
              
              <Separator className="bg-border/60" />
              
              <div>
                <span className="text-xs text-muted-foreground block mb-1.5">Regularization Status</span>
                <Badge variant="outline" className="font-semibold text-xs py-0.5 px-2.5 bg-neutral-100/50 dark:bg-neutral-900/30">
                  {regularizationStatus}
                </Badge>
              </div>
              
              <Separator className="bg-border/60" />
              
              <div>
                <span className="text-xs text-muted-foreground block mb-1.5">Administrative Notes</span>
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/40 min-h-[64px]">
                  {record.notes || "No notes available."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}