"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DepartmentDetails } from "@/components/departments/department-details";
import { getDepartmentById } from "@/mock/department";

interface PageProps {
  readonly params: Promise<{
    departmentId: string;
  }>;
}

export default function DepartmentPage({
  params,
}: PageProps) {
  const router = useRouter();
  const { departmentId } = use(params);

  const department = React.useMemo(
    () => getDepartmentById(departmentId),
    [departmentId]
  );

  const handleDelete = React.useCallback(() => {
    router.push("/dashboard/departments");
  }, [router]);

  if (!department) {
    return (
      <main className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">
          Department Not Found
        </h2>

        <p className="text-center text-sm text-muted-foreground">
          The requested department could not be found.
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
    <main className="flex-1 space-y-4 p-8 pt-6">
      <DepartmentDetails
        department={department}
        onDelete={handleDelete}
      />
    </main>
  );
}