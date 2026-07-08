"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AttendanceForm,
  type AttendanceFormValues,
} from "@/components/attendance/attendance-form";

export default function CreateAttendancePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle cancelled form submissions by returning to the dashboard
  const handleCancel = () => {
    router.push("/attendance");
  };

  // Process and simulate persistence of the verified record
  const handleCreate = async (data: AttendanceFormValues) => {
    void data;
    setIsSubmitting(true);
    try {
      // Simulate REST API database write latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO:
      // Integrate with Attendance API once the backend module is implemented.
      // Persist AttendanceFormValues and refresh attendance statistics.

      router.push("/attendance");
      router.refresh();
    } catch {
      // TODO:
      // Display a toast notification once the notification system is implemented.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Top Header Block with Back Trigger */}
      <div className="flex flex-col space-y-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 text-xs font-medium gap-1.5 pl-1.5 text-muted-foreground hover:text-foreground transition-all"
            aria-label="Back to attendance dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Attendance</span>
          </Button>
        </div>

        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create Attendance Record
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create a new employee attendance record.
          </p>
        </div>
      </div>

      {/* Main Reusable Form Card wrapper */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Attendance Information
          </CardTitle>
          <CardDescription className="text-xs">
            Provide daily timesheet details and parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AttendanceForm
            initialData={undefined}
            onSubmit={handleCreate}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            submitLabel="Create Record"
          />
        </CardContent>
      </Card>
    </div>
  );
}