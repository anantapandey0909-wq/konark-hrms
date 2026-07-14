import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import type { Employee } from "@/types/employee";
import type { CreatePayrollFormData } from "@/schemas/payroll";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYROLL_STATUS_VALUES, PAYROLL_MONTH_VALUES } from "@/schemas/payroll";
import { formatPayrollMonth, formatPayrollStatus } from "@/lib/payroll";

interface PayrollBasicInfoProps {
  form: UseFormReturn<CreatePayrollFormData>;
  employees: Employee[];
  loading?: boolean;
}

const setValueOptions = {
  shouldValidate: true,
  shouldDirty: true,
  shouldTouch: true,
};

const formatDateForInput = (value?: string): string =>
  value ? value.slice(0, 10) : "";

/**
 * PayrollBasicInfo Component
 *
 * A presentation-only component designed to manage and edit basic payroll entry metadata.
 *
 * Architectural Guidelines:
 * - This component is entirely presentational and relies on the state passed from a parent form.
 * - Business logic, including salary, attendance, and leave calculations, belongs in separate modules/handlers.
 * - Avoid performing any direct API operations or calculations here.
 * - Designed for seamless reuse with future backend integrations.
 */
export function PayrollBasicInfo({ form, employees, loading = false }: PayrollBasicInfoProps) {
  const handleEmployeeChange = useCallback((employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return;

    const fullName = `${employee.fullName} `.trim();

    form.setValue("employeeId", employee.id, setValueOptions);
    form.setValue("employeeCode", employee.employeeCode ?? "", setValueOptions);
    form.setValue("employeeName", fullName, setValueOptions);
    form.setValue("department", employee.department ?? "Engineering", setValueOptions);
    form.setValue("designation", employee.designation ?? "", setValueOptions);
  }, [employees, form]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Specify employee selection and basic payroll definitions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employee Selection */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel htmlFor="employee-select">Employee</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleEmployeeChange(value);
                  }}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger id="employee-select" aria-label="Select Employee">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.fullName}  ({emp.employeeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payroll Number */}
          <FormField
            control={form.control}
            name="payrollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="payrollNumber">Payroll Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="payrollNumber"
                    disabled={loading}
                    placeholder="PAY-2025-001"
                    aria-label="Payroll Number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employee Code (Read-Only) */}
          <FormField
            control={form.control}
            name="employeeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="employeeCode">Employee Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="employeeCode"
                    readOnly
                    disabled={loading}
                    placeholder="Auto-populated"
                    aria-label="Employee Code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employee Name (Read-Only) */}
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="employeeName">Employee Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="employeeName"
                    readOnly
                    disabled={loading}
                    placeholder="Auto-populated"
                    aria-label="Employee Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department (Read-Only) */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="department">Department</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="department"
                    readOnly
                    disabled={loading}
                    placeholder="Auto-populated"
                    aria-label="Department"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Designation (Read-Only) */}
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="designation">Designation</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="designation"
                    readOnly
                    disabled={loading}
                    placeholder="Auto-populated"
                    aria-label="Designation"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payroll Month */}
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="month">Payroll Month</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger id="month" aria-label="Payroll Month">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYROLL_MONTH_VALUES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {formatPayrollMonth(m)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Year */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="year">Year</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="year"
                    type="number"
                    min={2000}
                    max={2100}
                    step={1}
                    disabled={loading}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ""}
                    aria-label="Year"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payroll Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="status">Payroll Status</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger id="status" aria-label="Payroll Status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYROLL_STATUS_VALUES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatPayrollStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pay Period Start */}
          <FormField
            control={form.control}
            name="payPeriodStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="payPeriodStart">Pay Period Start</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="payPeriodStart"
                    type="date"
                    disabled={loading}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={formatDateForInput(field.value)}
                    placeholder="Select date"
                    aria-label="Pay Period Start"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pay Period End */}
          <FormField
            control={form.control}
            name="payPeriodEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="payPeriodEnd">Pay Period End</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="payPeriodEnd"
                    type="date"
                    disabled={loading}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={formatDateForInput(field.value)}
                    placeholder="Select date"
                    aria-label="Pay Period End"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Generated Date */}
          <FormField
            control={form.control}
            name="generatedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="generatedAt">Generated Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="generatedAt"
                    type="date"
                    disabled={loading}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={formatDateForInput(field.value)}
                    placeholder="Select date"
                    aria-label="Generated Date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Paid Date */}
          <FormField
            control={form.control}
            name="paidAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="paidAt">Paid Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="paidAt"
                    type="date"
                    disabled={loading}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                    value={formatDateForInput(field.value)}
                    placeholder="Select date"
                    aria-label="Paid Date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
