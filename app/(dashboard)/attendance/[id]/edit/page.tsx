"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AttendanceForm,
  type AttendanceFormValues,
} from "@/components/attendance/attendance-form";
import { mockAttendanceRecords } from "@/mock/attendance";

export default function EditAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params?.id === "string" ? params.id : "";

  const attendanceRecord = React.useMemo(
  () => mockAttendanceRecords.find((record) => record.id === id),
  [id]
);

  const handleUpdate = async (_data: AttendanceFormValues): Promise<void> => {
    void _data;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO:
      // Integrate Attendance Update API once backend is available.
      // Persist AttendanceFormValues.
      // Refresh attendance dashboard statistics.

      if (attendanceRecord) {
        router.push(`/attendance/${attendanceRecord.id}`);
        router.refresh();
      }
    } catch  {
      // TODO:
      // Show toast notification after notification service is implemented.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    if (attendanceRecord) {
      router.push(`/attendance/${attendanceRecord.id}`);
    } else {
      router.push("/attendance");
    }
  };

  if (!attendanceRecord) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="p-3 bg-destructive/10 rounded-full text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-semibold tracking-tight">Attendance Record Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The attendance record you are trying to edit does not exist, or you do not have permission to view it.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/attendance")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Attendance
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Attendance Record
          </h1>
          <p className="text-muted-foreground">
            Modify attendance information and update the employee attendance record.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card">
        <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
          <CardTitle>Attendance Details</CardTitle>
          <CardDescription>
            Update the daily log status, times, and remarks for the employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceForm
            initialData={attendanceRecord}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}