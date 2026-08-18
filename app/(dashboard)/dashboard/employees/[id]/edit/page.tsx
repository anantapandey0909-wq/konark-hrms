"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { EmployeeForm } from "@/components/employee/form/employee-form";
import type { EmployeeFormData } from "@/components/employee/form/employee-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";
import {
  fetchEmployee,
  fetchEmployees,
  patchEmployee,
} from "@/lib/data/employees";
import { fetchDepartments } from "@/lib/data/departments";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [managers, setManagers] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);

  const id = typeof params?.id === "string" ? params.id : "";

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [emp, depts, emps] = await Promise.all([
          fetchEmployee(id),
          fetchDepartments(),
          fetchEmployees(),
        ]);
        if (!cancelled) {
          setEmployee(emp);
          setDepartments(depts);
          setManagers(emps.filter((e) => e.id !== id));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (formData: EmployeeFormData) => {
    setSubmitting(true);
    try {
      await patchEmployee(id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
        departmentId: formData.departmentId ?? undefined,
        managerId: formData.managerId,
        designation: formData.designation,
        status: formData.status,
        employmentType: formData.employmentType,
        joiningDate: formData.joiningDate,
        employeeId: formData.employeeId,
      });
      toast.success("Employee updated successfully.");
      router.push(`/dashboard/employees/${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update employee."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/employees/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
        Loading employee…
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 -ml-2 text-xs"
            asChild
          >
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Directory</span>
            </Link>
          </Button>
        </div>
        <Card className="border border-red-200/40 bg-red-500/5 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-sm font-semibold text-red-600">
              Employee Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs text-red-500/80">
              The employee profile with ID &ldquo;{id}&rdquo; could not be
              retrieved from the active workspace.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-sm text-muted-foreground">
          Modify corporate and metadata fields for{" "}
          <span className="font-semibold text-foreground">{fullName}</span>{" "}
          (Ref: {employee.employeeId})
        </p>
      </div>

      <EmployeeForm
        mode="edit"
        defaultValues={employee}
        departments={departments}
        managers={managers}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
