"use client";
import * as React from "react";
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
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import {
Employee,
EmployeeRole,
Gender,
EmploymentType,
Department,
} from "@/types/employee";
interface EmployeeFormProps {
initialData?: Partial<Employee>;
onSubmit: (data: any) => void;
onCancel: () => void;
isLoading?: boolean;
}
export function EmployeeForm({
initialData,
onSubmit,
onCancel,
isLoading = false,
}: EmployeeFormProps) {
const [formData, setFormData] = React.useState({
firstName: initialData?.fullName?.split(" ")[0] || "",
lastName: initialData?.fullName?.split(" ").slice(1).join(" ") || "",
email: initialData?.email || "",
phone: initialData?.phone || "",
gender: (initialData?.gender || "") as Gender | "",
employeeCode: initialData?.employeeCode || "",
department: (initialData?.department || "") as Department | "",
designation: initialData?.designation || "",
role: (initialData?.role || "") as EmployeeRole | "",
employmentType: (initialData?.employmentType || "") as EmploymentType | "",
joiningDate: initialData?.joiningDate
? new Date(initialData.joiningDate).toISOString().split("T")[0]
: "",
});
const handleChange = (field: string, value: string) => {
setFormData((prev) => ({
...prev,
[field]: value,
}));
};
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
onSubmit(formData);
};
return (
<Card className="w-full max-w-4xl mx-auto border-neutral-200 dark:border-neutral-800">
<CardHeader>
<CardTitle className="text-xl font-semibold tracking-tight">
{initialData ? "Edit Employee Profile" : "Register New Employee"}
</CardTitle>
<CardDescription>
Enter the personal and professional details of the employee.
</CardDescription>
</CardHeader>
<CardContent>
<form onSubmit={handleSubmit} className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@konark.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Employee Code */}
        <div className="space-y-2">
          <Label htmlFor="employeeCode">Employee ID / Code</Label>
          <Input
            id="employeeCode"
            placeholder="KN-10204"
            value={formData.employeeCode}
            onChange={(e) => handleChange("employeeCode", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => handleChange("department", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENGINEERING">Engineering</SelectItem>
              <SelectItem value="PRODUCT">Product</SelectItem>
              <SelectItem value="DESIGN">Design</SelectItem>
              <SelectItem value="HR">Human Resources</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="SALES">Sales</SelectItem>
              <SelectItem value="FINANCE">Finance</SelectItem>
              <SelectItem value="OPERATIONS">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            placeholder="Software Engineer"
            value={formData.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Role (RBAC) */}
        <div className="space-y-2">
          <Label htmlFor="role">System Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleChange("role", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select system role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="HR">HR Manager</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select
            value={formData.employmentType}
            onValueChange={(value) => handleChange("employmentType", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="employmentType">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL_TIME">Full-time</SelectItem>
              <SelectItem value="PART_TIME">Part-time</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
              <SelectItem value="INTERN">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Joining Date */}
        <div className="space-y-2">
          <Label htmlFor="joiningDate">Joining Date</Label>
          <Input
            id="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => handleChange("joiningDate", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving changes..." : "Save Record"}
        </Button>
      </div>
    </form>
  </CardContent>
</Card>
);
}