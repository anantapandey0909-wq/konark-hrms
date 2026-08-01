"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DepartmentForm } from "@/components/departments/department-form";
import { getDepartmentById } from "@/mock/department";
import { DepartmentFormData } from "@/types/department";

interface PageProps {
  readonly params: Promise<{
    departmentId: string;
  }>;
}

export default function EditDepartmentPage({
  params,
}: PageProps) {
  const router = useRouter();
  const { departmentId } = use(params);

  const department = React.useMemo(
    () => getDepartmentById(departmentId),
    [departmentId]
  );

  // Always define this so hooks are called unconditionally
  const currentDepartmentId = department?.id ?? departmentId;

  const handleSubmit = React.useCallback(
    async (data: DepartmentFormData): Promise<void> => {
      console.log("Updated Department:", data);

      // ------------------------------------------------------------------
      // TODO:
      // await updateDepartment(currentDepartmentId, data);
      // ------------------------------------------------------------------

      router.push(
        `/dashboard/departments/${currentDepartmentId}`
      );
    },
    [router, currentDepartmentId]
  );

  const handleCancel = React.useCallback(() => {
    router.push(
      `/dashboard/departments/${currentDepartmentId}`
    );
  }, [router, currentDepartmentId]);

  if (!department) {
    return (
      <main className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">
          Department Not Found
        </h2>

        <p className="text-center text-sm text-muted-foreground">
          The department you are looking for does not exist or
          may have been removed.
        </p>

        <Button asChild>
          <Link href="/dashboard/departments">
            Back to Departments
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col space-y-6 p-8 pt-6">
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-fit"
        >
          <Link
            href={`/dashboard/departments/${currentDepartmentId}`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Department
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Update department information, hierarchy,
            managers, and operational settings.
          </p>
        </div>
      </div>

      <DepartmentForm
        initialData={department}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </main>
  );
}