"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
import { saveAttendance } from "@/lib/data/attendance";

export default function CreateAttendancePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFormSubmit = async (
    values: Parameters<
      React.ComponentProps<typeof AttendanceForm>["onSubmit"]
    >[0]
  ) => {
    setIsSubmitting(true);
    try {
      await saveAttendance({
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
      toast.success("Attendance created.");
      router.push("/dashboard/attendance");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create attendance record"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/attendance");
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/attendance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Log Attendance
          </h1>
          <p className="text-muted-foreground text-sm">
            Manually create and log a new employee attendance entry.
          </p>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Attendance Log Entry</CardTitle>
          <CardDescription>
            Specify checking thresholds, work locations, shifts, and
            regularization states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceForm
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
          {isSubmitting && (
            <p className="mt-2 text-xs text-muted-foreground">Saving…</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
