import { UseFormReturn } from "react-hook-form";
import type { CreatePayrollFormData } from "@/schemas/payroll";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PayrollAttendanceSectionProps {
  form: UseFormReturn<CreatePayrollFormData>;
  loading?: boolean;
}

type AttendanceSummaryKey = keyof CreatePayrollFormData["attendanceSummary"];

type AttendanceFieldPath =
  `attendanceSummary.${AttendanceSummaryKey}`;

interface AttendanceFieldConfig {
  name: AttendanceSummaryKey;
  label: string;
  id: string;
}

const attendanceFields: AttendanceFieldConfig[] = [
  { name: "workingDays", label: "Working Days", id: "workingDays" },
  { name: "presentDays", label: "Present Days", id: "presentDays" },
  { name: "absentDays", label: "Absent Days", id: "absentDays" },
  { name: "paidLeaveDays", label: "Paid Leave Days", id: "paidLeaveDays" },
  { name: "unpaidLeaveDays", label: "Unpaid Leave Days", id: "unpaidLeaveDays" },
  { name: "overtimeHours", label: "Overtime Hours", id: "overtimeHours" },
  { name: "lateEntries", label: "Late Entries", id: "lateEntries" },
];

const parseNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export function PayrollAttendanceSection({ form, loading = false }: PayrollAttendanceSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>
          Specify employee working days, present days, leaves, overtime, and late entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendanceFields.map((field) => {
            const fieldPath: AttendanceFieldPath =
  `attendanceSummary.${field.name}`;
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={fieldPath}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        id={field.id}
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        disabled={loading}
                        onChange={(e) => formField.onChange(parseNumber(e.target.value))}
                        value={formField.value ?? 0}
                        aria-label={field.label}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
