"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft, Loader2, Save, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";

const departmentFormSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().nullable().optional(),
  managerId: z.string().nullable().optional(),
  parentDepartmentId: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  sortOrder: z.coerce.number().min(1, "Sort order must be greater than 0"),
  budget: z.coerce.number().nullable().optional(),
});

type FormValues = z.input<typeof departmentFormSchema>;
type FormOutput = z.output<typeof departmentFormSchema>;

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      managerId: "",
      parentDepartmentId: "",
      status: "ACTIVE",
      sortOrder: 1,
      budget: null,
    },
  });

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

  const onSubmit = async (values: FormOutput) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Department Created Successfully", {
        description: `Successfully created business unit ${values.name} (${values.code}).`,
      });

      router.push("/dashboard/departments");
    } catch (error) {
      toast.error("Operation Failed", {
        description: "An unexpected error occurred while creating the department.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <Button onClick={() => router.push("/dashboard/departments")} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Departments
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b">
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Create Business Unit</CardTitle>
              <CardDescription>
                Establish a new department, allocate operational budgets, and assign leadership.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Sales, Marketing, IT" {...field} value={String(field.value ?? "")} />
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
                          <Input placeholder="e.g. SLS, MKT, IT" {...field} value={String(field.value ?? "")} />
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
                      <FormLabel>Brief Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Summarize the core operational scope of this business unit..."
                          className="min-h-[80px] resize-none"
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="managerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Manager</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value ?? "")}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Assign a manager" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Manager (Unassigned)</SelectItem>
                            {mockEmployees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.firstName} {emp.lastName} ({emp.employeeId})
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
                        <Select onValueChange={field.onChange} defaultValue={String(field.value ?? "")}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Independent (Top Level)</SelectItem>
                            {mockDepartments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name} ({dept.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operational Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
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
                          <Input type="number" {...field} value={String(field.value ?? "")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allocated Budget</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="USD" {...field} value={String(field.value ?? "")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/departments")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Establish Department
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}