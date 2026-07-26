"use client";

import * as React from "react";
import { ResolvedDepartment } from "@/types/department";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentOverview } from "./department-overview";
import { DepartmentMembers } from "./department-members";
import { DepartmentBudget } from "./department-budget";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { DepartmentDeleteDialog } from "./department-delete-dialog";

interface DepartmentDetailsProps {
  readonly department: ResolvedDepartment;
  readonly onDelete: (id: string) => void;
}

export function DepartmentDetails({ department, onDelete }: DepartmentDetailsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/departments" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{department.name}</h1>
          <p className="text-xs text-muted-foreground">
            Administrative division key: <span className="font-mono font-semibold">{department.code}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/departments/${department.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <DepartmentOverview department={department} />
        </TabsContent>
        <TabsContent value="members">
          <DepartmentMembers departmentId={department.id} />
        </TabsContent>
        <TabsContent value="budget">
          <DepartmentBudget department={department} />
        </TabsContent>
      </Tabs>

      <DepartmentDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        departmentName={department.name}
        onConfirm={() => onDelete(department.id)}
      />
    </div>
  );
}