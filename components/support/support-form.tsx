"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
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
import { supportTicketSchema } from "@/schemas/support-schema";
import {
  SUPPORT_STATUS_VALUES,
  SUPPORT_PRIORITY_VALUES,
  SUPPORT_CATEGORY_VALUES,
} from "@/types/support";
import type { z } from "zod";
import type { SupportTicket, SupportEmployee } from "@/types/support";

type SupportFormValues = z.infer<typeof supportTicketSchema>;

interface SupportFormProps {
  initialData?: SupportTicket | null;
  employees: SupportEmployee[];
  agents: SupportEmployee[];
  onSubmit: (data: SupportFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SupportForm({
  initialData,
  employees,
  agents,
  onSubmit,
  onCancel,
  isLoading = false,
}: SupportFormProps) {
  const isEditMode = !!initialData;

  const defaultValues = React.useMemo<Partial<SupportFormValues>>(() => {
    if (initialData) {
      return {
        subject: initialData.subject,
        employeeId: initialData.employeeId,
        category: initialData.category,
        priority: initialData.priority,
        description: initialData.description,
        status: initialData.status,
      };
    }
    return {
      subject: "",
      employeeId: "",
      category: "GENERAL",
      priority: "LOW",
      description: "",
      status: "OPEN",
    };
  }, [initialData]);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Subject Field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief summary of the issue..."
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employee Requestor Selection */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee (Requestor)</FormLabel>
                <Select
                  disabled={isLoading || isEditMode}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ticket requestor..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORT_CATEGORY_VALUES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority Field */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORT_PRIORITY_VALUES.map((prio) => (
                      <SelectItem key={prio} value={prio}>
                        {prio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field (Only rendered in Edit mode) */}
          {isEditMode && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUPPORT_STATUS_VALUES.map((stat) => (
                        <SelectItem key={stat} value={stat}>
                          {stat.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Detailed Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide diagnostic logs, browser details or structural issue contexts..."
                    className="min-h-[120px] resize-none"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="shadow-sm">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Save Changes" : "Submit Ticket"}
          </Button>
        </div>
      </form>
    </Form>
  );
}