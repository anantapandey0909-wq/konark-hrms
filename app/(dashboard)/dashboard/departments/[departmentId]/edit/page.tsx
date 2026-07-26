"use client";

import * as React from "react";
import { getDepartmentById, mockDepartments } from "@/mock/department";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockEmployees } from "@/mock/employee";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DepartmentStatus } from "@/types/department";

interface PageProps {
  readonly params: Promise<{ departmentId: string }>;
}

export default function EditDepartmentPage({ params }: PageProps) {
  const router = useRouter();
  const { departmentId } = use(params);

  const originalDepartment = React.useMemo(() => getDepartmentById(departmentId), [departmentId]);

  const [name, setName] = React.useState(originalDepartment?.name ?? "");
  const [code, setCode] = React.useState(originalDepartment?.code ?? "");
  const [description, setDescription] = React.useState(originalDepartment?.description ?? "");
  const [managerId, setManagerId] = React.useState(originalDepartment?.managerId ?? "none");
  const [parentDepartmentId, setParentDepartmentId] = React.useState(originalDepartment?.parentDepartmentId ?? "none");
  const [status, setStatus] = React.useState<DepartmentStatus>(originalDepartment?.status ?? "ACTIVE");
  const [sortOrder, setSortOrder] = React.useState(originalDepartment?.sortOrder ?? 1);
  const [budget, setBudget] = React.useState(originalDepartment?.budget ?? 0);

  if (!originalDepartment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-2">
        <h2 className="text-xl font-bold">Department Not Found</h2>
        <p className="text-sm text-muted-foreground">The department requested does not exist in our systems.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/departments/${departmentId}`);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-3xl">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href={`/dashboard/departments/${departmentId}`} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Cancel
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Department</h1>
        <p className="text-sm text-muted-foreground">
          Modify active values, managers, and allocations for the {originalDepartment.name} division.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-lg border p-6 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dept-name">Department Name</Label>
            <Input id="dept-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-code">Department Code</Label>
            <Input id="dept-code" value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dept-desc">Description</Label>
          <Input id="dept-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dept-manager">Department Manager</Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger id="dept-manager">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Manager Assigned</SelectItem>
                {mockEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.designation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-parent">Parent Department</Label>
            <Select value={parentDepartmentId} onValueChange={setParentDepartmentId}>
              <SelectTrigger id="dept-parent">
                <SelectValue placeholder="Select Parent Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Root level)</SelectItem>
                {mockDepartments
                  .filter((d) => d.id !== departmentId)
                  .map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dept-status">Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as DepartmentStatus)}>
              <SelectTrigger id="dept-status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-sort">Sort Order</Label>
            <Input
              id="dept-sort"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-budget">Budget Allocation ($)</Label>
            <Input
              id="dept-budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/departments/${departmentId}`}>Cancel</Link>
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}