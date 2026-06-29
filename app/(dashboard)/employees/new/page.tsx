"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Employee } from "@/types/employee";
import { EmployeeForm } from "@/components/employee/form/employee-form";

export default function NewEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: Partial<Employee>) => {
    setIsLoading(true);

    try {
      // TODO: Replace with POST /api/employees when backend is ready
      console.log("New Employee:", data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      router.push("/employees");
      router.refresh();
    } catch (error) {
      console.error("Failed to create employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/employees");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 p-6 min-h-[calc(100vh-64px)] bg-neutral-50/40 dark:bg-neutral-950/20"
    >
      {/* Breadcrumb */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        Employees /{" "}
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          Add Employee
        </span>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Add New Employee
        </h1>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Create a new employee profile and assign organizational details.
        </p>
      </div>

      {/* Employee Form */}
      <EmployeeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </motion.div>
  );
}