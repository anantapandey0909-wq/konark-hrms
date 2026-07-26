"use client";

// ============================================================================
// Imports
// ============================================================================

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AttendanceWithEmployee } from "@/types/attendance";
import { mockEmployees } from "@/mock/employee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ============================================================================
// Schema
// ============================================================================

/**
 * Zod schema enforcing typing and validation rules for an individual attendance log.
 * Grouped logically to support multi-tenant operational constraints.
 */
const attendanceSchema = z.object({
  // Identity & Timeline
  employeeId: z.string().min(1, "Employee selection is required"),
  attendanceDate: z.string().min(1, "Date is required"),

  // Clock Metadata & Measures
  checkIn: z.string().nullable().optional(),
  checkOut: z.string().nullable().optional(),
  totalHours: z.preprocess(
    (val) => (val === "" || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  overtimeHours: z.preprocess(
    (val) => (val === "" || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  breakDuration: z.preprocess(
    (val) => (val === "" || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),

  // Categorization
  status: z.enum(["PRESENT", "ABSENT", "LATE", "ON_LEAVE", "HALF_DAY"]),
  workMode: z.enum(["OFFICE", "REMOTE", "HYBRID"]),

  // Descriptors and audit records
  remarks: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  shiftName: z.string().nullable().optional(),
  isRegularized: z.boolean().default(false),
});

// ============================================================================
// Types
// ============================================================================

export type AttendanceFormValues = z.output<typeof attendanceSchema>;
type AttendanceFormInput = z.input<typeof attendanceSchema>;

interface AttendanceFormProps {
  readonly record?: AttendanceWithEmployee | null;
  readonly onSubmit: (data: AttendanceFormValues) => void;
  readonly onCancel: () => void;
}

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_OPTIONS: readonly SelectOption[] = [
  { value: "PRESENT", label: "Present" },
  { value: "LATE", label: "Late" },
  { value: "HALF_DAY", label: "Half Day" },
  { value: "ABSENT", label: "Absent" },
  { value: "ON_LEAVE", label: "On Leave" },
] as const;

const WORK_MODE_OPTIONS: readonly SelectOption[] = [
  { value: "OFFICE", label: "Office" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Initializes form default state dynamically mapping onto the input schema type.
 * Standardizes empty string/null boundaries to prevent React uncontrolled-to-controlled input errors.
 */
function getDefaultValues(record?: AttendanceWithEmployee | null): AttendanceFormInput {
  return {
    employeeId: record?.attendance.employeeId ?? "",
    attendanceDate: record?.attendance.attendanceDate ?? new Date().toISOString().split("T")[0],
    checkIn: record?.attendance.checkIn ?? "",
    checkOut: record?.attendance.checkOut ?? "",
    totalHours: record?.attendance.totalHours ?? null,
    overtimeHours: record?.attendance.overtimeHours ?? null,
    breakDuration: record?.attendance.breakDuration ?? null,
    status: record?.attendance.status ?? "PRESENT",
    workMode: record?.attendance.workMode ?? "OFFICE",
    remarks: record?.attendance.remarks ?? "",
    location: record?.attendance.location ?? "",
    shiftName: record?.attendance.shiftName ?? "General Shift",
    isRegularized: record?.attendance.isRegularized ?? false,
  };
}

/**
 * Normalizes input form payloads for secure, relational database insertion.
 * Converts empty input strings back to standard database Null representations.
 */
function normalizeAttendanceFormValues(values: AttendanceFormValues): AttendanceFormValues {
  return {
    ...values,
    checkIn: values.checkIn || null,
    checkOut: values.checkOut || null,
    remarks: values.remarks || null,
    location: values.location || null,
    shiftName: values.shiftName || null,
  };
}

// ============================================================================
// Component
// ============================================================================

export function AttendanceForm({ record, onSubmit, onCancel }: AttendanceFormProps) {
  // Explicitly binding useForm to the Zod input type prevents generic resolver type mismatches.
  const form = useForm<AttendanceFormInput>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: getDefaultValues(record),
  });

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleSubmitInternal = React.useCallback(
    (values: AttendanceFormInput) => {
      const parsedValues = attendanceSchema.parse(values);
      onSubmit(normalizeAttendanceFormValues(parsedValues));
    },
    [onSubmit]
  );

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitInternal)} className="space-y-4">
        
        {/* Section 1: Employee and Date Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!record}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.designation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attendanceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attendance Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={!!record} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 2: Attendance Status and Work Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Work Mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {WORK_MODE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 3: Check-in & Check-out Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check In Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 2025-01-15T09:00:00.000Z"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className="text-[11px]">
                  ISO standard format or empty
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check Out Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 2025-01-15T18:00:00.000Z"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className="text-[11px]">
                  ISO standard format or empty
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 4: Operational Metrics & Break Durations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="totalHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 8.5"
                    value={field.value !== null && field.value !== undefined ? `${field.value}` : ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overtimeHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overtime Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1.5"
                    value={field.value !== null && field.value !== undefined ? `${field.value}` : ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breakDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Break duration (mins)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 45"
                    value={field.value !== null && field.value !== undefined ? `${field.value}` : ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 5: Structural Context Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shiftName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="General Shift"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Location"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 6: Regularization Compliance Flags */}
        <FormField
          control={form.control}
          name="isRegularized"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Mark as Regularized</FormLabel>
                <FormDescription>
                  Manually adjust and resolve anomalies or logs for payroll.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Section 7: Audit Remarks & Historical Context */}
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add shift notes or audit history details"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Section 8: Dialog Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {record ? "Save Changes" : "Create Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
}