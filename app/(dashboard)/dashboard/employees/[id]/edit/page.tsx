"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
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
import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const id = params?.id as string;
  const employee = mockEmployees.find((e: Employee) => e.id === id);

  const handleSubmit = async (formData: EmployeeFormData) => {
    setSubmitting(true);
    try {
      // Mock API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitting Updated Employee Data:", formData);
      router.push(`/dashboard/employees/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/employees/${id}`);
  };

  if (!employee) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/employees" passHref>
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Directory</span>
            </Button>
          </Link>
        </div>
        <Card className="border border-red-200/40 bg-red-500/5 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-sm font-semibold text-red-600">Employee Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs text-red-500/80">
              The employee profile with ID "{id}" could not be retrieved from the active workspace.
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
          <span className="font-semibold text-foreground">{fullName}</span> (Ref: {employee.employeeId})
        </p>
      </div>

      <EmployeeForm
        mode="edit"
        defaultValues={employee}
        departments={mockDepartments}
        managers={mockEmployees.filter((e: Employee) => e.id !== id)} // Block self-reporting
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}