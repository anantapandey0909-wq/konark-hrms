import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartmentDetails } from "@/components/departments/department-details";
import { getDepartmentById } from "@/mock/department";

interface PageProps {
  params: Promise<{
    departmentId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { departmentId } = await params;
  const department = getDepartmentById(departmentId);

  if (!department) {
    return {
      title: "Department Not Found | Konark HRMS",
    };
  }

  return {
    title: `${department.name} | Konark HRMS`,
    description: department.description || "Department details and organizational information.",
  };
}

export default async function DepartmentDetailsPage({ params }: PageProps) {
  const { departmentId } = await params;
  const department = getDepartmentById(departmentId);

  if (!department) {
    notFound();
  }

  return (
    <main className="container py-6 space-y-6" id="main-content">
      <DepartmentDetails department={department} />
    </main>
  );
}