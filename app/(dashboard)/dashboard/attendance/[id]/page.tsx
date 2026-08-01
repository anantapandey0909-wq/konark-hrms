import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Award, 
  FileText,
  Building,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { mockEmployees } from "@/mock/employee";
import type { AttendanceWithEmployee } from "@/types/attendance";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Resilient mock resolver to guarantee seamless rendering on click-throughs
function resolveAttendanceDetails(id: string): AttendanceWithEmployee | null {
  const cleanId = id.trim();
  
  // Find employee by internal id (e.g. emp-101) or business id (e.g. K-00234)
  const employee = mockEmployees.find(
    (e) => e.id === cleanId || e.id === cleanId.replace("att-", "emp-") || e.employeeId === cleanId
  );

  if (!employee) {
    return null;
  }

  // Construct a standard normalized AttendanceWithEmployee view object
  return {
    id: `att-${employee.id}`,
    attendance: {
      id: `att-${employee.id}`,
      tenantId: employee.tenantId,
      employeeId: employee.id,
      attendanceDate: employee.status === "ACTIVE" ? "2025-01-15" : "2025-01-14",
      checkIn: "2025-01-15T09:02:14.000Z",
      checkOut: "2025-01-15T18:15:30.000Z",
      totalHours: 9.2,
      overtimeHours: 1.2,
      breakDuration: 45,
      status: employee.status === "ON_LEAVE" ? "ON_LEAVE" : "PRESENT",
      workMode: "OFFICE",
      remarks: "Standard productive day. Completed all designated sprint cycles successfully.",
      location: "Head Office",
      shiftName: "General Office Shift (09:00 AM - 06:00 PM)",
      isRegularized: false,
      createdAt: "2025-01-15T18:15:30.000Z",
      updatedAt: "2025-01-15T18:15:30.000Z"
    },
    employee: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      avatarUrl: employee.avatarUrl,
      designation: employee.designation,
      departmentId: employee.departmentId
    }
  };
}

const formatTime = (isoString: string | null): string => {
  if (!isoString) return "--:--";
  return new Date(isoString).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default async function AttendanceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const record = resolveAttendanceDetails(id);

  if (!record) {
    notFound();
  }

  const { attendance, employee } = record;
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const departmentName = employee.departmentId?.replace("dept-", "").replace("-", " ") || "General";

  // Single source of truth references directly from the Attendance entity
  const shiftName = attendance.shiftName || "General Office Shift (09:00 AM - 06:00 PM)";
  const isRegularized = attendance.isRegularized ?? false;
  const locationDisplay = attendance.location || "On-Site";

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs" asChild>
          <Link href="/dashboard/attendance">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Attendance</span>
          </Link>
        </Button>
        <span className="text-xs font-medium text-muted-foreground font-mono">
          ID: {attendance.id}
        </span>
      </div>

      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-primary/10 bg-muted shrink-0">
            {employee.avatarUrl ? (
              <img 
                src={employee.avatarUrl} 
                alt={fullName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground font-bold">
                {employee.firstName.charAt(0) + employee.lastName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                {fullName}
              </h1>
              <AttendanceStatusBadge status={attendance.status} />
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {employee.designation} • <span className="capitalize">{departmentName}</span>
            </p>
            <p className="text-[10px] font-mono text-muted-foreground/80 mt-1">
              Ref: {attendance.employeeId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-border">
          <div className="text-left md:text-right">
            <p className="text-xs text-muted-foreground font-medium">Attendance Date</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              {formatDate(attendance.attendanceDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Time Card */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-sm font-semibold tracking-tight inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Shift Timing Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Clock In</span>
              <span className="font-bold tabular-nums text-foreground">
                {formatTime(attendance.checkIn)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Clock Out</span>
              <span className="font-bold tabular-nums text-foreground">
                {formatTime(attendance.checkOut)}
              </span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Total Duration</span>
              <span className="font-bold text-foreground">
                {attendance.totalHours !== null ? `${attendance.totalHours.toFixed(2)} hrs` : "--"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Operational Context Card */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-sm font-semibold tracking-tight inline-flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <span>Operational Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Work Mode</span>
              <span className="font-semibold capitalize text-foreground">
                {attendance.workMode.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Location</span>
              <span className="font-semibold inline-flex items-center gap-1 text-foreground">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{locationDisplay}</span>
              </span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Break Duration</span>
              <span className="font-bold text-foreground">
                {attendance.breakDuration ? `${attendance.breakDuration} mins` : "--"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Overtime & Policy Card */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-sm font-semibold tracking-tight inline-flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Overtime & Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Overtime Log</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {attendance.overtimeHours && attendance.overtimeHours > 0 
                  ? `+${attendance.overtimeHours.toFixed(1)} hrs` 
                  : "0.0 hrs"
                }
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Regularized</span>
              <span className="font-semibold inline-flex items-center gap-1">
                {isRegularized ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Yes</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-muted-foreground/80">No</span>
                  </>
                )}
              </span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Tenant ID</span>
              <span className="font-mono text-muted-foreground text-[10px]">
                {attendance.tenantId}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Informational Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Remarks Panel */}
        <Card className="md:col-span-2 shadow-sm border-border">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-sm font-semibold tracking-tight inline-flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Timesheet Remarks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {attendance.remarks || "No operational notes logged for this timesheet period."}
            </p>
          </CardContent>
        </Card>

        {/* Shift Specification Details */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-sm font-semibold tracking-tight inline-flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span>Policy Framework</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5 text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Shift Template</p>
              <p className="text-[11px] mt-1 leading-snug">{shiftName}</p>
            </div>
            <div className="pt-2">
              <p className="font-semibold text-foreground">Grace Period</p>
              <p className="text-[11px] mt-1 leading-snug">15 minutes dynamic buffer threshold</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}