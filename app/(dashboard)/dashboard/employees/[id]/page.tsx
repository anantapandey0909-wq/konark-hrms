"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { mockEmployees } from "@/mock/employee";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/employee";

const formatDateString = (
  dateString: string | null
): string => {
  if (!dateString) {
    return "N/A";
  }

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

  const employee = mockEmployees.find(
    (e: Employee) => e.id === id
  );

  if (!employee) {
    notFound();
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;

  const initials =
    `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

  const departmentName =
    employee.departmentId
      ?.replace("dept-", "")
      .replace("-", " ") || "General";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1.5 text-xs"
        >
          <Link href="/dashboard/employees">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Directory</span>
          </Link>
        </Button>

        <Button
          asChild
          size="sm"
          className="h-8 gap-1.5 rounded-xl text-xs"
        >
          <Link
            href={`/dashboard/employees/${employee.id}/edit`}
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Link>
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:flex-row sm:text-left">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          {employee.avatarUrl ? (
            <AvatarImage
              src={employee.avatarUrl}
              alt={fullName}
            />
          ) : null}

          <AvatarFallback className="text-base font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex flex-col justify-center gap-2 sm:flex-row sm:items-center sm:justify-start">
            <h2 className="text-xl font-bold tracking-tight">
              {fullName}
            </h2>

            <Badge
              variant="outline"
              className={cn(
                "self-center rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                employee.status === "ACTIVE" &&
                  "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
                employee.status === "ON_LEAVE" &&
                  "border-amber-500/20 bg-amber-500/10 text-amber-600",
                employee.status === "INACTIVE" &&
                  "border-zinc-500/20 bg-zinc-500/10 text-zinc-600",
                employee.status === "TERMINATED" &&
                  "border-red-500/20 bg-red-500/10 text-red-600"
              )}
            >
              {employee.status.replace("_", " ")}
            </Badge>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            {employee.designation} •{" "}
            <span className="capitalize">
              {departmentName}
            </span>
          </p>

          <p className="font-mono text-[10px] text-muted-foreground/80">
            Ref ID: {employee.employeeId}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border/40 bg-muted/5 pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3.5 pt-4 text-xs">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{employee.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                {employee.phone ??
                  "No phone number registered"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="capitalize">
                {employee.workLocation ?? "Remote"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/40 bg-muted/5 pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Employment Classification
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] font-medium text-muted-foreground">
                  Joining Date
                </p>

                <p className="mt-0.5 font-semibold">
                  {formatDateString(
                    employee.joiningDate
                  )}
                </p>
              </div>
            </div>

            {employee.relievingDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 shrink-0 text-red-500" />

                <div>
                  <p className="text-[10px] font-medium text-red-500">
                    Relieving Date
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {formatDateString(
                      employee.relievingDate
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] font-medium text-muted-foreground">
                  Job Classification
                </p>

                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  {employee.employmentType.replace(
                    "_",
                    " "
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border/40 bg-muted/5 pb-3">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            System & Reporting Metadata
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 pt-6 text-xs sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-[10px] font-medium text-muted-foreground">
                Reporting Manager ID
              </p>

              <p className="mt-0.5 font-mono text-[10px]">
                {employee.managerId ??
                  "No Active Manager (Top-level)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-[10px] font-medium text-muted-foreground">
                Workspace Partition (Tenant ID)
              </p>

              <p className="mt-0.5 font-mono text-[10px]">
                {employee.tenantId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}