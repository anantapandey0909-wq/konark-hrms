"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { mockAttendanceWithEmployees } from "@/mock/attendance";
import { AttendanceForm } from "@/components/attendance/attendance-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);

  const attendanceId = React.useMemo(() => {
    return typeof params?.id === "string" ? params.id : "";
  }, [params?.id]);

  const record = React.useMemo(() => {
    if (!attendanceId) return null;
    return mockAttendanceWithEmployees.find((r) => r.id === attendanceId) ?? null;
  }, [attendanceId]);

  const handleFormSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      // In a real application, we would call a Server Action or API here:
      // await updateAttendanceRecord(attendanceId, values);
      
      // Simulate backend latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      router.push("/dashboard/attendance");
    } catch (error) {
      console.error("Failed to save attendance record", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/attendance");
  };

  if (!record) {
    return (
      <div className="flex-1 p-8 pt-6 max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/dashboard/attendance" className="flex items-center gap-1">
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
              The requested attendance record with ID <span className="font-mono font-bold text-foreground">"{attendanceId}"</span> could not be located in our systems.
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
          <Link href="/dashboard/attendance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Attendance</h1>
          <p className="text-muted-foreground text-sm">
            Modify time logs, statuses, and location details for {record.employee.firstName} {record.employee.lastName}.
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