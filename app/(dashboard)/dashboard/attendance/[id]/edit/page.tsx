"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { AttendanceForm } from "@/components/attendance/attendance-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  fetchAttendance,
  patchAttendance,
} from "@/lib/data/attendance";
import type { AttendanceWithEmployee } from "@/types/attendance";

export default function EditAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [record, setRecord] = React.useState<AttendanceWithEmployee | null>(
    null
  );

  const attendanceId = typeof params?.id === "string" ? params.id : "";

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!attendanceId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const row = await fetchAttendance(attendanceId);
        if (!cancelled) setRecord(row);
      } catch {
        if (!cancelled) setRecord(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attendanceId]);

  const handleFormSubmit = async (
    values: Parameters<
      React.ComponentProps<typeof AttendanceForm>["onSubmit"]
    >[0]
  ) => {
    setIsSaving(true);
    try {
      await patchAttendance(attendanceId, {
        employeeId: values.employeeId,
        attendanceDate: values.attendanceDate,
        checkIn: values.checkIn || null,
        checkOut: values.checkOut || null,
        totalHours: values.totalHours || null,
        overtimeHours: values.overtimeHours || null,
        breakDuration: values.breakDuration || null,
        status: values.status,
        workMode: values.workMode,
        remarks: values.remarks || null,
        location: values.location || null,
        shiftName: values.shiftName || null,
        isRegularized: values.isRegularized,
      });
      toast.success("Attendance updated.");
      router.push(`/dashboard/attendance/${attendanceId}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save attendance record"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(
      attendanceId
        ? `/dashboard/attendance/${attendanceId}`
        : "/dashboard/attendance"
    );
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 pt-6 text-sm text-muted-foreground">
        Loading attendance…
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex-1 p-8 pt-6 max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link
            href="/dashboard/attendance"
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Record Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The requested attendance record with ID{" "}
              <span className="font-mono font-bold text-foreground">
                &ldquo;{attendanceId}&rdquo;
              </span>{" "}
              could not be located in our systems.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/attendance/${attendanceId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Attendance
          </h1>
          <p className="text-muted-foreground text-sm">
            Modify time logs, statuses, and location details for{" "}
            {record.employee.firstName} {record.employee.lastName}.
            {isSaving ? " Saving…" : ""}
          </p>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Update Log Parameters</CardTitle>
          <CardDescription>
            Adjust check times, statuses, and shift parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceForm
            record={record}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
