"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmployeeForm } from "@/components/employee/form/employee-form";
import type { EmployeeFormData } from "@/components/employee/form/employee-form";
import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";
import { fetchEmployees, saveEmployee } from "@/lib/data/employees";
import { fetchDepartments } from "@/lib/data/departments";

export default function NewEmployeePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [managers, setManagers] = React.useState<Employee[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [depts, emps] = await Promise.all([
          fetchDepartments(),
          fetchEmployees(),
        ]);
        if (!cancelled) {
          setDepartments(depts);
          // EmployeeListResult: managers are the items array
          setManagers(emps.items);
        }
      } catch {
        /* keep empty */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (values: EmployeeFormData) => {
    if (!values.departmentId) {
      toast.error("Department is required.");
      return;
    }

    setSubmitting(true);
    try {
      await saveEmployee({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        avatarUrl: values.avatarUrl,
        departmentId: values.departmentId,
        managerId: values.managerId,
        designation: values.designation,
        status: values.status,
        employmentType: values.employmentType,
        joiningDate: values.joiningDate,
        employeeId: values.employeeId,
      });
      toast.success("Employee created successfully.");
      router.push("/dashboard/employees");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create employee."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/employees");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Add Employee</h1>
        <p className="text-sm text-muted-foreground">
          Register a new employee profile to the active workspace organization.
        </p>
      </div>

      <EmployeeForm
        mode="create"
        departments={departments}
        managers={managers}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
