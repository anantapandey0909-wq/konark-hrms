"use client";

import { useRouter } from "next/navigation";

import {
  EmployeeForm,
  type EmployeeFormData,
} from "@/components/employee/form/employee-form";

export default function NewEmployeePage() {
  const router = useRouter();

  const handleSubmit = (data: EmployeeFormData) => {
    console.log("New Employee:", data);

    // TODO:
    // Replace with backend API call when backend integration is implemented.

    router.push("/dashboard/employees");
  };

  const handleCancel = () => {
    router.push("/dashboard/employees");
  };

  return (
    <main className="container mx-auto py-6">
      <EmployeeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </main>
  );
}