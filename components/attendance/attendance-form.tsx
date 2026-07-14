"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { mockEmployees } from "@/mock/employee";
import type { AttendanceRecord } from "@/types/attendance";

const attendanceFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required."),
  date: z.string().min(1, "Date is required."),
  clockInAt: z.union([
  z.string(),
  z.null(),
]),

clockOutAt: z.union([
  z.string(),
  z.null(),
]),
  status: z.enum([
    "PRESENT",
    "ABSENT",
    "LATE",
    "HALF_DAY",
    "ON_LEAVE",
  ]),
  shiftName: z.string().optional(),
  location: z.string().optional(),
  isRegularized: z.boolean().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
}).refine((data) => {
  const needsTime = data.status === "PRESENT" || data.status === "LATE" || data.status === "HALF_DAY";
  if (needsTime && !data.clockInAt) {
    return false;
  }
  return true;
}, {
  message: "Clock In time is required for this status.",
  path: ["clockInAt"],
}).refine((data) => {
  if (data.clockInAt && data.clockOutAt) {
    const [inHours, inMinutes] = data.clockInAt.split(":").map(Number);
    const [outHours, outMinutes] = data.clockOutAt.split(":").map(Number);
    const inMinutesTotal = inHours * 60 + inMinutes;
    const outMinutesTotal = outHours * 60 + outMinutes;
    return outMinutesTotal >= inMinutesTotal;
  }
  return true;
}, {
  message: "Clock Out time cannot be before Clock In.",
  path: ["clockOutAt"],
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export interface AttendanceFormProps {
  initialData?: Partial<AttendanceRecord>;
  onSubmit: (data: AttendanceFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const extractTimeFromIso = (isoString: string | null | undefined): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      if (/^\d{2}:\d{2}$/.test(isoString)) return isoString;
      return "";
    }
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export function AttendanceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Record",
}: AttendanceFormProps) {
  const defaultValues = useMemo<AttendanceFormValues>(() => {
    return {
      employeeId: initialData?.employeeId ?? "",
      date: initialData?.date ?? "",
      clockInAt: extractTimeFromIso(initialData?.clockInAt),
      clockOutAt: extractTimeFromIso(initialData?.clockOutAt),
      status: initialData?.status ?? "PRESENT",
      shiftName: initialData?.shiftName ?? "General Shift",
      location: initialData?.location ?? "Office",
      isRegularized: initialData?.isRegularized ?? false,
      notes: initialData?.notes ?? "",
    };
  }, [initialData]);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues,
  });

  const { watch, control, handleSubmit } = form;

  const selectedEmployeeId = watch("employeeId");
  const currentStatus = watch("status");

  const derivedDepartment = useMemo(() => {
    const matchedEmployee = mockEmployees.find((emp) => emp.id === selectedEmployeeId);
    return matchedEmployee?.department ?? "--";
  }, [selectedEmployeeId]);

  const areTimeFieldsDisabled = currentStatus === "ABSENT" || currentStatus === "ON_LEAVE";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Employee Selection */}
          <FormField
            control={control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Employee</FormLabel>
                <Select
  value={field.value}
  onValueChange={field.onChange}
  disabled={isLoading || !!initialData}
>
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id} className="text-xs">
                        {emp.fullName} ({emp.employeeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department (Derived & Read-Only) */}
          <div className="space-y-2">
            <FormLabel className="text-xs font-semibold">Department</FormLabel>
            <FormControl>
              <Input 
                value={derivedDepartment} 
                disabled 
                className="h-9 text-xs bg-muted/40 cursor-not-allowed" 
                placeholder="Auto-populated"
              />
            </FormControl>
          </div>

          {/* Attendance Date */}
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    disabled={isLoading}
                    className="h-9 text-xs" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assigned Shift */}
          <FormField
            control={control}
            name="shiftName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Shift</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value ?? ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Shift" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="General Shift" className="text-xs">General Shift (09:00 AM - 06:00 PM)</SelectItem>
                    <SelectItem value="Night Shift" className="text-xs">Night Shift (10:00 PM - 07:00 AM)</SelectItem>
                    <SelectItem value="Morning Shift" className="text-xs">Morning Shift (06:00 AM - 03:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Clock In */}
          <FormField
            control={control}
            name="clockInAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Clock In</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    disabled={isLoading || areTimeFieldsDisabled}
                    className="h-9 text-xs disabled:bg-muted/40 disabled:opacity-50"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Clock Out */}
          <FormField
            control={control}
            name="clockOutAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Clock Out</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    disabled={isLoading || areTimeFieldsDisabled}
                    className="h-9 text-xs disabled:bg-muted/40 disabled:opacity-50"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Attendance Status */}
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRESENT" className="text-xs">Present</SelectItem>
                    <SelectItem value="ABSENT" className="text-xs">Absent</SelectItem>
                    <SelectItem value="LATE" className="text-xs">Late</SelectItem>
                    <SelectItem value="HALF_DAY" className="text-xs">Half Day</SelectItem>
                    <SelectItem value="ON_LEAVE" className="text-xs">On Leave</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Location */}
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Location</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value ?? ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Office" className="text-xs">Office</SelectItem>
                    <SelectItem value="Remote" className="text-xs">Remote</SelectItem>
                    <SelectItem value="Client Site" className="text-xs">Client Site</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Regularized Toggle */}
          <FormField
            control={control}
            name="isRegularized"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 shadow-sm md:col-span-2">
                <div className="space-y-0.5">
                  <FormLabel className="text-xs font-semibold">Regularized Record</FormLabel>
                  <p className="text-[10px] text-muted-foreground">
                    Flag this record as manually regularized or adjusted by HR.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Notes (Full Width) */}
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter administrative notes or comments here..." 
                  className="min-h-[100px] text-xs resize-none"
                  disabled={isLoading}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Row */}
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
            className="h-8 text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isLoading}
            className="h-8 text-xs font-medium"
          >
            {isLoading ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
