"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ResolvedDepartment,
  DepartmentFormData,
} from "@/types/department";
import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export interface DepartmentFormProps {
  readonly initialData?: ResolvedDepartment | null;
  readonly onSubmit: (data: DepartmentFormData) => void | Promise<void>;
  readonly onCancel: () => void;
  readonly isSubmitting?: boolean;
}

const departmentValidationSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(2, "Department code must be at least 2 characters"),
  description: z.string().nullable(),
  managerId: z.string().nullable(),
  parentDepartmentId: z.string().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  sortOrder: z.number().min(1, "Sort order must be at least 1"),
  budget: z.number().nullable(),
});

type FormValues = z.infer<typeof departmentValidationSchema>;

export function DepartmentForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DepartmentFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(departmentValidationSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      code: initialData?.code ?? "",
      description: initialData?.description ?? null,
      managerId: initialData?.managerId ?? null,
      parentDepartmentId: initialData?.parentDepartmentId ?? null,
      status: initialData?.status ?? "ACTIVE",
      sortOrder: initialData?.sortOrder ?? 1,
      budget: initialData?.budget ?? null,
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Engineering" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ENG" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the department's core responsibilities and operational parameters..."
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="managerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Head / Manager</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                  value={field.value ?? "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Division Manager" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Manager Assigned</SelectItem>
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
            name="parentDepartmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Department</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                  value={field.value ?? "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Parent Division" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None (Root level)</SelectItem>
                    {mockDepartments
                      .filter((d) => d.id !== initialData?.id)
                      .map((dept) => (
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value === "" ? 1 : Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Relative sorting priority</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Budget ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 500000"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : Number(val));
                    }}
                  />
                </FormControl>
                <FormDescription>Allocated fiscal pool</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Department"}
          </Button>
        </div>
      </form>
    </Form>
  );
}