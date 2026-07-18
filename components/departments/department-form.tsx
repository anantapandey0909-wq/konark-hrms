"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Building2, ArrowLeft, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { departmentSchema } from "@/lib/validation/department";
import { DEPARTMENT_STATUS_VALUES } from "@/types/department";
import type { Department, DepartmentFormData } from "@/types/department";
import type { Employee } from "@/types/employee";

interface DepartmentFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<DepartmentFormData>;
  employees: Employee[];
  departments: Department[];
  isSubmitting?: boolean;
  onSubmit: (values: DepartmentFormData) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export function DepartmentForm({
  mode,
  defaultValues,
  employees,
  departments,
  isSubmitting = false,
  onSubmit,
  onCancel,
  className,
}: DepartmentFormProps) {
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      status: "ACTIVE",
      parentDepartmentId: null,
      headEmployeeId: null,
      managerEmployeeId: null,
      allocatedBudget: 0,
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (values: DepartmentFormData) => {
    // Normalize select values from standard null-equivalent strings back to real nulls
    const normalizedValues: DepartmentFormData = {
      ...values,
      parentDepartmentId:
        values.parentDepartmentId === "none" || values.parentDepartmentId === ""
          ? null
          : values.parentDepartmentId,
      headEmployeeId:
        values.headEmployeeId === "none" || values.headEmployeeId === ""
          ? null
          : values.headEmployeeId,
      managerEmployeeId:
        values.managerEmployeeId === "none" || values.managerEmployeeId === ""
          ? null
          : values.managerEmployeeId,
    };

    await onSubmit(normalizedValues);
  };

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full max-w-4xl mx-auto", className)}
    >
      <Card className="overflow-hidden rounded-xl border border-muted/60 bg-card shadow-sm">
        <CardHeader className="border-b border-muted/40 pb-4 flex flex-row items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground tracking-tight select-none">
            {mode === "create" ? "Create New Department" : "Edit Department Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Department Code */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. ENG, HR, FIN"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Engineering, Sales"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the department's responsibilities and mandate..."
                            className="rounded-xl border-muted/60 resize-none min-h-[80px]"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {DEPARTMENT_STATUS_VALUES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status === "ACTIVE" ? "Active" : "Inactive"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Parent Department */}
                <FormField
                  control={form.control}
                  name="parentDepartmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Department</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="No Parent Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="none">No Parent Department</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department Head */}
                <FormField
                  control={form.control}
                  name="headEmployeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Head</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="none">Unassigned</SelectItem>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.fullName} ({emp.employeeId || emp.employeeCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department Manager */}
                <FormField
                  control={form.control}
                  name="managerEmployeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Manager</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="none">Unassigned</SelectItem>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.fullName} ({emp.employeeId || emp.employeeCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Allocated Budget */}
                <FormField
                  control={form.control}
                  name="allocatedBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocated Budget</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 500000"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Currency (Select - Readonly INR Display) */}
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select defaultValue="INR" disabled>
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-muted/60 bg-muted/20 text-muted-foreground cursor-not-allowed">
                        <SelectValue placeholder="INR" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-muted/30">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-xl border-muted/60 flex items-center gap-2 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl flex items-center gap-2 font-medium transition-transform duration-100 active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : mode === "create"
                      ? "Create Department"
                      : "Save Changes"}
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}