"use client";

// ============================================================================
// Imports
// ============================================================================

import * as React from "react";
import { AttendanceWithEmployee } from "@/types/attendance";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, ShieldAlert } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface AttendanceTableProps {
  readonly data: readonly AttendanceWithEmployee[];
  readonly onEdit: (record: AttendanceWithEmployee) => void;
}

interface BadgeConfig {
  readonly label: string;
  readonly className: string;
  readonly variant: "default" | "secondary" | "outline" | "destructive";
}

type AttendanceStatus = AttendanceWithEmployee["attendance"]["status"];
type WorkMode = AttendanceWithEmployee["attendance"]["workMode"];

// ============================================================================
// Configuration
// ============================================================================

/**
 * Static lookup mapping for attendance status badges.
 * Centralizing UI configurations outside of the render lifecycle optimizes memory
 * allocation and simplifies visual style updates.
 */
const STATUS_BADGE_CONFIG: Record<string, BadgeConfig> = {
  PRESENT: {
    label: "Present",
    variant: "default",
    className: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  LATE: {
    label: "Late",
    variant: "secondary",
    className: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  HALF_DAY: {
    label: "Half Day",
    variant: "outline",
    className: "text-orange-500 border-orange-500",
  },
  ON_LEAVE: {
    label: "On Leave",
    variant: "outline",
    className: "text-blue-500 border-blue-500",
  },
  ABSENT: {
    label: "Absent",
    variant: "destructive",
    className: "",
  },
} as const;

/**
 * Static lookup mapping for work mode badges.
 */
const WORK_MODE_BADGE_CONFIG: Record<string, BadgeConfig> = {
  OFFICE: {
    label: "Office",
    variant: "outline",
    className: "border-indigo-200 text-indigo-700 bg-indigo-50/50",
  },
  REMOTE: {
    label: "Remote",
    variant: "outline",
    className: "border-teal-200 text-teal-700 bg-teal-50/50",
  },
  HYBRID: {
    label: "Hybrid",
    variant: "outline",
    className: "border-purple-200 text-purple-700 bg-purple-50/50",
  },
} as const;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Resolves and renders the badge associated with a given attendance status.
 * Fallbacks safely to the raw status key if missing in the configuration mapping.
 */
function renderStatusBadge(status: AttendanceStatus): React.JSX.Element {
  const config = STATUS_BADGE_CONFIG[status];
  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

/**
 * Resolves and renders the badge associated with a given work mode.
 * Fallbacks safely to the raw work mode key if missing in the configuration mapping.
 */
function renderWorkModeBadge(workMode: WorkMode): React.JSX.Element {
  const config = WORK_MODE_BADGE_CONFIG[workMode];
  if (!config) {
    return <Badge variant="outline">{workMode}</Badge>;
  }
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

/**
 * Safely formats a localized hour-minute string from an ISO timestamp.
 */
function formatAttendanceTime(isoString: string | null): string {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch {
    return "-";
  }
}

/**
 * Renders the tabular display of cumulative working hours and active overtime indicators.
 */
function renderHours(totalHours: number | null, overtimeHours: number | null): React.JSX.Element {
  return (
    <div className="text-sm">
      <div>{totalHours !== null ? `${totalHours} hrs` : "-"}</div>
      {overtimeHours !== null && overtimeHours > 0 && (
        <div className="text-xs text-emerald-600 font-medium">
          +{overtimeHours} Overtime
        </div>
      )}
    </div>
  );
}

/**
 * Renders the compound employee profiling cell, containing user avatar,
 * name, designation details, and corresponding accessibility tags.
 */
function renderEmployeeCell(employee: AttendanceWithEmployee["employee"]): React.JSX.Element {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName[0] ?? ""}${employee.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={employee.avatarUrl ?? undefined} alt={fullName} />
        <AvatarFallback className="text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-sm">{fullName}</div>
        <div className="text-xs text-muted-foreground">{employee.designation}</div>
      </div>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function AttendanceTable({ data, onEdit }: AttendanceTableProps) {
  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Hours / Overtime</TableHead>
            <TableHead>Mode / Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No attendance records matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                {/* Employee Profiling */}
                <TableCell className="font-medium">
                  {renderEmployeeCell(row.employee)}
                </TableCell>

                {/* Relational Metadata */}
                <TableCell className="text-sm">{row.attendance.attendanceDate}</TableCell>
                <TableCell className="text-sm">
                  <span className="font-medium text-foreground">
                    {row.attendance.shiftName ?? "No Shift"}
                  </span>
                </TableCell>

                {/* Clock Transactions */}
                <TableCell className="text-sm font-mono text-muted-foreground">
                  {formatAttendanceTime(row.attendance.checkIn)}
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground">
                  {formatAttendanceTime(row.attendance.checkOut)}
                </TableCell>

                {/* Duration Performance */}
                <TableCell>
                  {renderHours(row.attendance.totalHours, row.attendance.overtimeHours)}
                </TableCell>

                {/* Operating Context */}
                <TableCell className="text-sm">
                  <div className="flex flex-col gap-1">
                    <div>{renderWorkModeBadge(row.attendance.workMode)}</div>
                    {row.attendance.location && (
                      <span className="text-xs text-muted-foreground">{row.attendance.location}</span>
                    )}
                  </div>
                </TableCell>

                {/* Status & Compliance Flags */}
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    {renderStatusBadge(row.attendance.status)}
                    {row.attendance.isRegularized && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold uppercase">
                        <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                        Regularized
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(row)}
                    aria-label={`Edit attendance for ${row.employee.firstName} ${row.employee.lastName}`}
                  >
                    <Edit2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}