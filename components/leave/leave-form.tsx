"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";
import type { LeaveFormData } from "@/types/leave";
import { fetchEmployees } from "@/lib/data/employees";
import { fetchDepartments } from "@/lib/data/departments";

const leaveFormSchema = z.object({
  employeeId: z.string().min(1, "Employee selection is required"),
  leaveType: z.enum([
    "CASUAL_LEAVE",
    "SICK_LEAVE",
    "EARNED_LEAVE",
    "MATERNITY_LEAVE",
    "PATERNITY_LEAVE",
    "COMP_OFF",
    "HALF_DAY",
    "WORK_FROM_HOME",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

interface LeaveFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<LeaveFormData>;
  onSubmit?: (values: LeaveFormData) => void | Promise<void>;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({
  mode = "create",
  initialData,
  onSubmit: parentOnSubmit,
  onCancel,
  onSuccess,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [listsLoading, setListsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListsLoading(true);
      try {
        const [emps, depts] = await Promise.all([
          fetchEmployees(),
          fetchDepartments(),
        ]);
        if (!cancelled) {
          setEmployees(emps);
          setDepartments(depts);
        }
      } catch {
        if (!cancelled) {
          setEmployees([]);
          setDepartments([]);
        }
      } finally {
        if (!cancelled) setListsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const defaultLeaveType = (initialData?.leaveType &&
  [
    "CASUAL_LEAVE",
    "SICK_LEAVE",
    "EARNED_LEAVE",
    "MATERNITY_LEAVE",
    "PATERNITY_LEAVE",
    "COMP_OFF",
    "HALF_DAY",
    "WORK_FROM_HOME",
  ].includes(initialData.leaveType)
    ? initialData.leaveType
    : "CASUAL_LEAVE") as LeaveFormValues["leaveType"];

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      employeeId: initialData?.employeeId ?? "",
      leaveType: defaultLeaveType,
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      reason: initialData?.reason ?? "",
    },
  });

  const selectedEmployeeId = form.watch("employeeId");
  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);
  const resolvedDepartment = selectedEmployee
    ? departments.find((dept) => dept.id === selectedEmployee.departmentId)
    : null;
  const resolvedManager = selectedEmployee
    ? employees.find((emp) => emp.id === selectedEmployee.managerId)
    : null;

  const employeeName = selectedEmployee
    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
    : "";
  const employeeCode = selectedEmployee ? selectedEmployee.employeeId : "";
  const departmentName = resolvedDepartment ? resolvedDepartment.name : "";
  const managerName = resolvedManager
    ? `${resolvedManager.firstName} ${resolvedManager.lastName}`
    : "";

  const onSubmit = async (values: LeaveFormValues) => {
    setIsSubmitting(true);
    try {
      if (parentOnSubmit) {
        const formData: LeaveFormData = {
          employeeId: values.employeeId,
          leaveType: values.leaveType,
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.reason,
          isHalfDay: values.leaveType === "HALF_DAY",
          duration: initialData?.duration ?? 0,
          status: initialData?.status ?? "PENDING",
          notes: initialData?.notes ?? "",
          attachmentName: initialData?.attachmentName ?? "",
          approver: initialData?.approver ?? "",
          employeeName,
          department: departmentName,
          employeeDisplayId: employeeCode,
        };
        await parentOnSubmit(formData);
      } else {
        toast.success(
          mode === "create"
            ? "Leave Applied Successfully"
            : "Leave Updated Successfully",
          {
            description: `Leave request has been submitted for ${employeeName}.`,
          }
        );
        form.reset();
        if (onSuccess) onSuccess();
        else router.push("/dashboard/leave");
      }
    } catch (error) {
      toast.error("Submission Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.push("/dashboard/leave");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Employee</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={listsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        listsLoading ? "Loading employees…" : "Select an employee"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees.map((emp) => (
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

        {selectedEmployee && (
          <div className="p-4 rounded-lg border bg-muted/40 space-y-3 text-sm">
            <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              Selected Employee Metadata
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground block text-xs">Full Name</span>
                <span className="font-medium text-foreground">{employeeName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Employee ID</span>
                <span className="font-medium text-foreground">{employeeCode}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Department</span>
                <span className="font-medium text-foreground">
                  {departmentName || "No Department Assigned"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">
                  Reporting Manager
                </span>
                <span className="font-medium text-foreground">
                  {managerName || "No Manager Assigned"}
                </span>
              </div>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CASUAL_LEAVE">Casual Leave</SelectItem>
                  <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                  <SelectItem value="EARNED_LEAVE">Earned Leave</SelectItem>
                  <SelectItem value="MATERNITY_LEAVE">Maternity Leave</SelectItem>
                  <SelectItem value="PATERNITY_LEAVE">Paternity Leave</SelectItem>
                  <SelectItem value="COMP_OFF">Compensatory Off</SelectItem>
                  <SelectItem value="HALF_DAY">Half Day</SelectItem>
                  <SelectItem value="WORK_FROM_HOME">Work From Home</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Leave</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe the detailed reason for applying this leave request"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide transparent reason for verification and audit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Applying..." : "Saving..."}
              </>
            ) : mode === "create" ? (
              "Submit Request"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
