"use client";

import * as React from "react";
import { getDepartmentById } from "@/mock/department";
import { DepartmentDetails } from "@/components/departments/department-details";
import { useRouter } from "next/navigation";
import { use } from "react";

interface PageProps {
  readonly params: Promise<{ departmentId: string }>;
}

export default function DepartmentPage({ params }: PageProps) {
  const router = useRouter();
  const { departmentId } = use(params);
  
  const department = React.useMemo(() => getDepartmentById(departmentId), [departmentId]);

  const handleDelete = () => {
    router.push("/dashboard/departments");
  };

  if (!department) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-2">
        <h2 className="text-xl font-bold">Department Not Found</h2>
        <p className="text-sm text-muted-foreground">The division with the requested identifier could not be located.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DepartmentDetails department={department} onDelete={handleDelete} />
    </div>
  );
}