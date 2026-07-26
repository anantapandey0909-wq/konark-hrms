"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { User, ArrowLeft, Check } from "lucide-react";
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
import type { Employee, EmployeeStatus, EmploymentType } from "@/types/employee";
import type { Department } from "@/types/department";

const EMPLOYEE_STATUS_VALUES = ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"] as const;
const EMPLOYMENT_TYPE_VALUES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"] as const;

export const employeeFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().nullable(),
  avatarUrl: z.string().url("Avatar must be a valid URL").nullable(),
  departmentId: z.string().nullable(),
  managerId: z.string().nullable(),
  designation: z.string().min(1, "Designation is required"),
  status: z.enum(EMPLOYEE_STATUS_VALUES),
  employmentType: z.enum(EMPLOYMENT_TYPE_VALUES),
  workLocation: z.string().nullable(),
  joiningDate: z.string().min(1, "Joining date is required"),
  relievingDate: z.string().nullable(),
  tenantId: z.string().min(1, "Tenant partition key is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Employee>;
  departments: Department[];
  managers: Employee[];
  isSubmitting?: boolean;
  onSubmit: (values: EmployeeFormData) => Promise<void> | void;
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

export function EmployeeForm({
  mode,
  defaultValues,
  departments,
  managers,
  isSubmitting = false,
  onSubmit,
  onCancel,
  className,
}: EmployeeFormProps) {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? null,
      avatarUrl: defaultValues?.avatarUrl ?? null,
      departmentId: defaultValues?.departmentId ?? null,
      managerId: defaultValues?.managerId ?? null,
      designation: defaultValues?.designation ?? "",
      status: defaultValues?.status ?? "ACTIVE",
      employmentType: defaultValues?.employmentType ?? "FULL_TIME",
      workLocation: defaultValues?.workLocation ?? null,
      joiningDate: defaultValues?.joiningDate ?? new Date().toISOString().split("T")[0],
      relievingDate: defaultValues?.relievingDate ?? null,
      tenantId: defaultValues?.tenantId ?? "tenant-konark-tech",
      employeeId: defaultValues?.employeeId ?? "",
    },
  });

  const handleFormSubmit = async (values: EmployeeFormData) => {
    const normalizedValues: EmployeeFormData = {
      ...values,
      departmentId:
        values.departmentId === "none" || values.departmentId === ""
          ? null
          : values.departmentId,
      managerId:
        values.managerId === "none" || values.managerId === ""
          ? null
          : values.managerId,
      phone: values.phone === "" ? null : values.phone,
      avatarUrl: values.avatarUrl === "" ? null : values.avatarUrl,
      workLocation: values.workLocation === "" ? null : values.workLocation,
      relievingDate: values.relievingDate === "" ? null : values.relievingDate,
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
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground tracking-tight select-none">
            {mode === "create" ? "Add New Employee" : "Edit Employee Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Sarah"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Jenkins"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="sarah.jenkins@konarktech.co.in"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. +91 80 4912 3456"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Employee ID */}
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. K-00234"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Work Location */}
                <FormField
                  control={form.control}
                  name="workLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Bangalore Office, Remote"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Designation */}
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Software Engineer"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department */}
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                        value={field.value ?? "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="none">Unassigned</SelectItem>
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

                {/* Employment Type */}
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="Select Classification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {EMPLOYMENT_TYPE_VALUES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {EMPLOYEE_STATUS_VALUES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Joining Date */}
                <FormField
                  control={form.control}
                  name="joiningDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joining Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Relieving Date */}
                <FormField
                  control={form.control}
                  name="relievingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relieving Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reporting Manager */}
                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Manager</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                        value={field.value ?? "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-muted/60">
                            <SelectValue placeholder="No Manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="none">No Manager (Top-level)</SelectItem>
                          {managers.map((mgr) => (
                            <SelectItem key={mgr.id} value={mgr.id}>
                              {mgr.firstName} {mgr.lastName} ({mgr.employeeId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Avatar URL */}
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. https://images.unsplash.com/..."
                          className="rounded-xl border-muted/60"
                          disabled={isSubmitting}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      ? "Add Employee"
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