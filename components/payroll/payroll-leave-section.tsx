import { UseFormReturn, Path } from "react-hook-form";
import type { CreatePayrollFormData } from "@/schemas/payroll";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PayrollLeaveSectionProps {
  form: UseFormReturn<CreatePayrollFormData>;
  loading?: boolean;
}

interface LeaveFieldConfig {
  name: Path<CreatePayrollFormData>;
  label: string;
  id: string;
}

const leaveFields: LeaveFieldConfig[] = [
  { name: "leaveSummary.totalLeaves", label: "Total Leaves", id: "totalLeaves" },
  { name: "leaveSummary.paidLeaves", label: "Paid Leaves", id: "paidLeaves" },
  { name: "leaveSummary.unpaidLeaves", label: "Unpaid Leaves", id: "unpaidLeaves" },
  { name: "leaveSummary.leaveWithoutPayDays", label: "Leave Without Pay Days", id: "leaveWithoutPayDays" },
];

const parseNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export function PayrollLeaveSection({ form, loading = false }: PayrollLeaveSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leave Summary</CardTitle>
        <CardDescription>
          Specify employee total leaves, paid leaves, unpaid leaves, and leave without pay days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaveFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
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
                      value={typeof formField.value === "number" ? formField.value : 0}
                      aria-label={field.label}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
