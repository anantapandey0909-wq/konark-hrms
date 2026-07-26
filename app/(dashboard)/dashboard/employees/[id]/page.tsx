"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building,
  User,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/types/employee";
import { mockEmployees } from "@/mock/employee";
import { cn } from "@/lib/utils";

const formatDateString = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function EmployeeDetailPage() {
  const params = useParams();
  
  const id = params?.id as string;
  const employee = mockEmployees.find((e: Employee) => e.id === id);

  if (!employee) {
    notFound();
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  const departmentName = employee.departmentId?.replace("dept-", "").replace("-", " ") || "General";

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/employees" passHref>
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Directory</span>
          </Button>
        </Link>
        <Link href={`/dashboard/employees/${employee.id}/edit`} passHref>
          <Button size="sm" className="gap-1.5 rounded-xl text-xs h-8">
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Button>
        </Link>
      </div>

      {/* Profile Header Block */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-xl border border-border bg-card shadow-sm text-center sm:text-left">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          {employee.avatarUrl ? (
            <AvatarImage src={employee.avatarUrl} alt={fullName} />
          ) : null}
          <AvatarFallback className="text-base font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{fullName}</h2>
            <Badge 
              variant="outline"
              className={cn(
                "rounded-xl px-2.5 py-0.5 text-[10px] font-bold tracking-tight uppercase self-center",
                employee.status === "ACTIVE" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                employee.status === "ON_LEAVE" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                employee.status === "INACTIVE" && "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
                employee.status === "TERMINATED" && "bg-red-500/10 text-red-600 border-red-500/20"
              )}
            >
              {employee.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {employee.designation} • <span className="capitalize">{departmentName}</span>
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/80">Ref ID: {employee.employeeId}</p>
        </div>
      </div>

      {/* Core Details Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Contact Information */}
        <Card className="border border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground font-medium">{employee.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground font-medium">{employee.phone || "No phone number registered"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground font-medium capitalize">{employee.workLocation || "Remote"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Employment Lifecycle Details */}
        <Card className="border border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Employment Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium text-[10px]">Joining Date</span>
                <span className="text-foreground font-semibold mt-0.5">{formatDateString(employee.joiningDate)}</span>
              </div>
            </div>
            {employee.relievingDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-red-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-red-500 font-medium text-[10px]">Relieving Date</span>
                  <span className="text-foreground font-semibold mt-0.5">{formatDateString(employee.relievingDate)}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium text-[10px]">Job Classification</span>
                <span className="text-foreground font-semibold mt-0.5 uppercase tracking-wide text-[10px]">
                  {employee.employmentType.replace("_", " ")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Structural Metadata and isolation parameters */}
      <Card className="border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            System & Reporting Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-6 sm:grid-cols-2 text-xs">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col">
              <span className="text-muted-foreground font-medium text-[10px]">Reporting Manager ID</span>
              <span className="text-foreground font-mono text-[10px] mt-0.5">{employee.managerId || "No Active Manager (Top-level)"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col">
              <span className="text-muted-foreground font-medium text-[10px]">Workspace Partition (Tenant ID)</span>
              <span className="text-foreground font-mono text-[10px] mt-0.5">{employee.tenantId}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}