"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft, Loader2, Save, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { calculateSalaryBreakdown } from "@/mock/payroll";
import { fetchPayrollRecord, patchPayroll } from "@/lib/data/payroll";
import type { PayrollRecord, PayrollStatus } from "@/types/payroll";

const payrollEditSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "PAID", "CANCELLED"]),
  basicSalary: z.coerce.number().min(1, "Basic salary must be greater than 0"),
  notes: z.string().optional(),
});

type FormValues = z.input<typeof payrollEditSchema>;
type FormOutput = z.output<typeof payrollEditSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPayrollPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [record, setRecord] = useState<PayrollRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(payrollEditSchema),
    defaultValues: {
      status: "DRAFT",
      basicSalary: 0,
      notes: "",
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const row = await fetchPayrollRecord(id);
        if (cancelled) return;
        setRecord(row);
        if (row) {
          form.reset({
            status: row.status,
            basicSalary: row.salaryBreakdown.basicSalary,
            notes: row.notes ?? "",
          });
        }
      } catch {
        if (!cancelled) setRecord(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, form]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading payroll…
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Payroll Statement Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The requested payroll statement could not be resolved in our system.
        </p>
        <Button onClick={() => router.push("/dashboard/payroll")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payroll Hub
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: FormOutput) => {
    setIsSubmitting(true);
    try {
      const updatedBreakdown = calculateSalaryBreakdown(values.basicSalary);
      await patchPayroll(id, {
        status: values.status as PayrollStatus,
        basicSalary: values.basicSalary,
        totalAllowances: updatedBreakdown.totalAllowances,
        totalDeductions: updatedBreakdown.totalDeductions,
        grossSalary: updatedBreakdown.grossSalary,
        netSalary: updatedBreakdown.netSalary,
        taxableIncome: updatedBreakdown.taxableIncome,
        allowances: updatedBreakdown.allowances,
        deductions: updatedBreakdown.deductions,
        notes: values.notes,
      });

      toast.success("Payroll Record Updated", {
        description: `Successfully modified statement ${record.payrollNumber} for ${record.employeeName}.`,
      });

      router.push(`/dashboard/payroll/${id}`);
      router.refresh();
    } catch (error) {
      toast.error("Modification Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while modifying the payroll record.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchBasicSalary = Number(form.watch("basicSalary")) || 0;
  const liveBreakdown = calculateSalaryBreakdown(watchBasicSalary);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => router.push(`/dashboard/payroll/${record.id}`)}
          variant="ghost"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adjust Payroll Statement</CardTitle>
              <CardDescription>
                Modify compensation metrics and workflow state for{" "}
                {record.employeeName}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workflow Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select workflow status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="APPROVED">Approved</SelectItem>
                              <SelectItem value="PAID">Paid</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Current approval or settlement status.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basicSalary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Basic Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={String(field.value ?? "")}
                            />
                          </FormControl>
                          <FormDescription>
                            Calculates total gross/net salary automatically.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audit Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add specific details or modifications justification notes here"
                            className="min-h-[100px] resize-none"
                            {...field}
                            value={String(field.value ?? "")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/payroll/${record.id}`)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Adjustments
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-3 border-b border-emerald-500/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Live Breakdown Preview
              </CardTitle>
              <CardDescription className="text-xs">
                Based on current basic salary changes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Basic Salary:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(liveBreakdown.basicSalary)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Allowances (HRA + LTA + Special):
                </span>
                <span className="font-semibold text-emerald-600">
                  +{formatCurrency(liveBreakdown.totalAllowances)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Deductions (PF + Tax + Ins):
                </span>
                <span className="font-semibold text-rose-500">
                  -{formatCurrency(liveBreakdown.totalDeductions)}
                </span>
              </div>
              <div className="border-t border-border my-2" />
              <div className="flex justify-between font-bold text-sm text-primary pt-1">
                <span>Estimated Net Pay:</span>
                <span>{formatCurrency(liveBreakdown.netSalary)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/40">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Relational Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5 text-xs text-muted-foreground">
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  FTE Name
                </span>
                <span className="font-medium text-foreground text-sm">
                  {record.employeeName}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  Operational Group
                </span>
                <span className="font-medium text-foreground">
                  {record.department.name}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  Designation
                </span>
                <span className="font-medium text-foreground">{record.designation}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  Pay Period
                </span>
                <span className="font-medium text-foreground">
                  {record.month} {record.year}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
