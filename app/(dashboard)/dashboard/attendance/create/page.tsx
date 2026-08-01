"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AttendanceForm } from "@/components/attendance/attendance-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateAttendancePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dynamically resolve form values from the child form component interface
  const handleFormSubmit = async (
    values: Parameters<React.ComponentProps<typeof AttendanceForm>["onSubmit"]>[0]
  ) => {
    setIsSubmitting(true);
    try {
      // In a real application, we would call a Server Action or an API route here:
      // await createAttendanceRecord(values);
      
      // Simulate backend latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      router.push("/dashboard/attendance");
    } catch (error) {
      // Gracefully handle submission error in future integrations
      console.error("Failed to create attendance record", error);
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Log Attendance</h1>
          <p className="text-muted-foreground text-sm">
            Manually create and log a new employee attendance entry.
          </p>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Attendance Log Entry</CardTitle>
          <CardDescription>
            Specify checking thresholds, work locations, shifts, and regularization states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceForm
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}