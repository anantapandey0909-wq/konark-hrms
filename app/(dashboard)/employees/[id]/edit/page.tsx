"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { mockEmployees } from "@/mock/employee";
import { EmployeeForm, EmployeeFormData } from "@/components/employee/form/employee-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);

  const employeeId = params?.id as string;

  // Find the employee by ID or by Employee Code (matching Profile robustness)
  const employee = React.useMemo(() => {
    return mockEmployees?.find(
      (e) => e.id === employeeId || e.employeeCode === employeeId
    );
  }, [employeeId]);

  const handleSave = async (formData: EmployeeFormData) => {
    setIsSaving(true);
    try {
      // Simulate network request latency to the backend database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a live application, update callback or API call would execute here:
      // await updateEmployee(employeeId, formData);

      router.push("/employees");
      router.refresh();
    } catch (error) {
      console.error("An error occurred while saving employee data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/employees/${employeeId}`);
  };

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
        <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Employee Not Found
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          The employee record with ID <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{employeeId}</span> could not be located in the directory database.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Directory
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      </div>

      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Edit Employee Profile
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Modify the profile credentials, departmental settings, and system roles of {employee.fullName}.
        </p>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Ensure updated information matches organizational compliance requirements.
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