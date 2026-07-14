import { UseFormReturn, useWatch } from "react-hook-form";
import type { CreatePayrollFormData } from "@/schemas/payroll";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface PayrollNotesSectionProps {
  form: UseFormReturn<CreatePayrollFormData>;
  loading?: boolean;
}

export function PayrollNotesSection({ form, loading = false }: PayrollNotesSectionProps) {
  const notesValue =
  useWatch({
    control: form.control,
    name: "notes",
  }) ?? "";

const characterCount = notesValue.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notes & Remarks</CardTitle>
        <CardDescription>
          Add payroll remarks, internal processing comments, or payment reference details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="notes">Remarks / Notes</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Textarea
                    {...field}
                    id="notes"
                    rows={6}
                    maxLength={1000}
                    disabled={loading}
                    className="resize-y"
                    placeholder="Add payroll remarks, internal notes or processing comments..."
                    aria-label="Payroll Notes"
                    value={field.value ?? ""}
                  />
                  <div className="text-right text-xs text-muted-foreground" aria-live="polite">
                    {characterCount} / 1000 characters
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
