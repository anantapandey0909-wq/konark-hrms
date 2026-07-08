"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { EmployeeForm, type EmployeeFormData } from "@/components/employee/form/employee-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockEmployees } from "@/mock/employee";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();

  const [isSaving, setIsSaving] = React.useState(false);

  const employeeId = params.id as string;

  const employee = React.useMemo(() => {
    return mockEmployees.find(
      (employee) =>
        employee.id === employeeId ||
        employee.employeeCode === employeeId
    );
  }, [employeeId]);

  const handleSave = async (formData: EmployeeFormData) => {
    setIsSaving(true);

    try {
      // Simulate backend request
      await new Promise((resolve) => setTimeout(resolve, 1000));
void formData;
      // Future backend integration:
      // await updateEmployee(employeeId, _formData);

      router.push("/employees");
      router.refresh();
    } catch (error) {
      console.error(
        "An error occurred while saving employee data:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/employees/${employeeId}`);
  };

  if (!employee) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="rounded-full bg-neutral-100 p-4 text-neutral-400 dark:bg-neutral-900">
          <AlertCircle className="h-10 w-10" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Employee Not Found
        </h2>

        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          The employee record with ID{" "}
          <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
            {employeeId}
          </span>{" "}
          could not be located in the directory database.
        </p>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-2"
        >
          <Link href="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Directory
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-1 flex-col space-y-6 p-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="-ml-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      </div>

      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Edit Employee Profile
        </h1>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Modify the profile credentials, departmental settings, and system
          roles of {employee.fullName}.
        </p>
      </div>

      <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>

          <CardDescription>
            Ensure updated information matches organizational compliance
            requirements.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <EmployeeForm
            initialData={employee}
            onSubmit={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        </CardContent>
      </Card>
    </div>
  );
}