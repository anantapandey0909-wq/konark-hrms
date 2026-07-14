import { UseFormReturn, Path } from "react-hook-form";
import type { CreatePayrollFormData } from "@/schemas/payroll";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PayrollSalarySectionProps {
  form: UseFormReturn<CreatePayrollFormData>;
  loading?: boolean;
}

interface SalaryFieldConfig {
  name: Path<CreatePayrollFormData>;
  label: string;
  id: string;
}

const salaryFields: SalaryFieldConfig[] = [
  { name: "salaryBreakdown.basicSalary", label: "Basic Salary", id: "basicSalary" },
  { name: "salaryBreakdown.grossSalary", label: "Gross Salary", id: "grossSalary" },
  { name: "salaryBreakdown.taxableIncome", label: "Taxable Income", id: "taxableIncome" },
  { name: "salaryBreakdown.totalAllowances", label: "Total Allowances", id: "totalAllowances" },
  { name: "salaryBreakdown.totalDeductions", label: "Total Deductions", id: "totalDeductions" },
  { name: "salaryBreakdown.netSalary", label: "Net Salary", id: "netSalary" },
];

const parseNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export function PayrollSalarySection({ form, loading = false }: PayrollSalarySectionProps) {
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Salary Breakdown</CardTitle>
          <CardDescription>
            Specify employee basic salary, gross, taxable income, allowances, deductions, and net salary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salaryFields.map((field) => (
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
                        step={0.01}
                        inputMode="decimal"
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

      <Card className="w-full">
  <CardHeader>
    <CardTitle>Allowances & Deductions</CardTitle>
    <CardDescription>
      Dynamic allowance and deduction management will be implemented in a future sprint.
    </CardDescription>
  </CardHeader>

  <CardContent>
    <p className="text-sm text-muted-foreground">
      This section will support dynamic allowance and deduction entries,
      including reusable payroll components and backend integration.
    </p>
  </CardContent>
</Card>
    </div>
  );
}
