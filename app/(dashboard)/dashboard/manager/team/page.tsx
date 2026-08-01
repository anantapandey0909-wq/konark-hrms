import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Users2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMembersTable } from "@/components/manager-portal/team-members-table";
import { mockTeamMembers } from "@/mock/manager-portal";

export const metadata: Metadata = {
  title: "Team Management — Konark HRMS",
  description: "Manage and coordinate platform engineering direct reports.",
};

export default function TeamDirectoryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs font-bold text-muted-foreground hover:text-slate-900"
        >
          <Link href="/dashboard/manager">
            <ArrowLeft className="h-4 w-4" />
            Back to Workspace
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
            <Users2 className="h-7 w-7 text-indigo-500" />
            <span>Direct Reports Directory</span>
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Detailed shift records, metrics, and communications access for your
            team.
          </p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">
            Allocated Engineers
          </CardTitle>

          <CardDescription className="text-xs">
            Review status updates and individual performance progress.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TeamMembersTable team={mockTeamMembers} />
        </CardContent>
      </Card>
    </div>
  );
}