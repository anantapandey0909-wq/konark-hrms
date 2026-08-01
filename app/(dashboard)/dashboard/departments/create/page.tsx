"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DepartmentForm } from "@/components/departments/department-form";
import { DepartmentFormData } from "@/types/department";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (data: DepartmentFormData): Promise<void> => {
      setIsSubmitting(true);

      try {
        console.log("Creating Department:", data);

        // ------------------------------------------------------------------
        // TODO:
        // await createDepartment(data);
        // ------------------------------------------------------------------

        toast.success("Department created successfully.");

        router.push("/dashboard/departments");
      } catch (error) {
        console.error(error);

        toast.error(
          "Something went wrong while creating the department."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  const handleCancel = React.useCallback(() => {
    router.push("/dashboard/departments");
  }, [router]);

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col space-y-6 p-8 pt-6">
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-fit"
        >
          <Link href="/dashboard/departments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Department
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a new department, assign leadership, and configure
            organizational settings.
          </p>
        </div>
      </div>

      <DepartmentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}