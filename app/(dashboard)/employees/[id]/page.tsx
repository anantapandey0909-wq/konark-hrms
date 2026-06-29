

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Shield,
  Edit2,
  UserMinus,
  Printer,
  Download,
  MapPin,
  Clock,
  CreditCard,
  FileText,
  Activity,
  ArrowLeft,
  CalendarDays,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockEmployees } from "@/mock/employee";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EmployeeProfilePage({
  params,
}: PageProps) {
  const { id } = await params;

  // Find the employee by ID or by Employee Code (for robustness)
  const employee = mockEmployees?.find(
    (e) => e.id === id || e.employeeCode === id
  );

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
        <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Employee Not Found
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          The employee record with ID <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{id}</span> could not be located in the directory database.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Directory
          </Link>
        </Button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div
      className="flex-1 space-y-6 p-6 max-w-7xl mx-auto"
    >
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
        >
          <Link href="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Link>
        </Button>
      </div>

      {/* Employee Header Block */}
      <div >
        <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800">
          <div className="h-32 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800" />
          <div className="p-6 relative -mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-neutral-950 shadow-md">
                <AvatarImage
  src={employee.avatar ?? undefined}
  alt={employee.fullName}
/>
               <AvatarFallback>
  {employee.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)}
</AvatarFallback>
              </Avatar>
              <div className="space-y-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    {employee.fullName} 
                  </h1>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
                    {employee.status}
                  </Badge>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                  {employee.designation} &bull; {employee.department}
                </p>
                <p className="text-neutral-400 text-xs">
                  Employee Code: <span className="font-mono text-neutral-600 dark:text-neutral-300 font-semibold">{employee.employeeCode}</span>
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-initial">
                <Printer className="mr-2 h-4 w-4 text-neutral-500" />
                Print
              </Button>
              <Button size="sm" variant="outline" className="flex-1 sm:flex-initial">
                <Download className="mr-2 h-4 w-4 text-neutral-500" />
                Export
              </Button>
              <Button size="sm" variant="outline" className="flex-1 sm:flex-initial" asChild>
                <Link href={`/employees/${id}/edit`}>
                  <Edit2 className="mr-2 h-4 w-4 text-neutral-500" />
                  Edit
                </Link>
              </Button>
              <Button size="sm" variant="destructive" className="flex-1 sm:flex-initial">
                <UserMinus className="mr-2 h-4 w-4" />
                Deactivate
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900 p-1 border border-neutral-200/50 dark:border-neutral-800/50 w-full justify-start overflow-x-auto whitespace-nowrap scrollbar-none">
          <TabsTrigger value="overview" className="gap-2">
            <User className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <Clock className="h-4 w-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="leave" className="gap-2">
            <CalendarDays className="h-4 w-4" /> Leave
          </TabsTrigger>
          <TabsTrigger value="payroll" className="gap-2">
            <CreditCard className="h-4 w-4" /> Payroll
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" /> Activity Log
          </TabsTrigger>
        </TabsList>

        {/* Tab Cards */}
        <TabsContent value="overview">
          <div>
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          
            {/* Left/Center side grids */}
            <div>
              <Card className="border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-neutral-500" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-neutral-400">Full Name</p>
                    <p className="font-medium">{employee.fullName} </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-400">Gender</p>
                    <p className="font-medium capitalize">{employee.gender?.toLowerCase() || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-400">Work Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                      {employee.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-400">Contact Number</p>
                    <p className="font-medium">{employee.phone || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-neutral-500" />
                    Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-neutral-400">Department</p>
                    <p className="font-medium">{employee.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-400">Designation</p>
                    <p className="font-medium">{employee.designation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-400">Employment Type</p>
                    <p className="font-medium capitalize">{employee.employmentType?.replace("_", " ").toLowerCase() || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-neutral-400">Joining Date</p>
                    <p className="font-medium">{employee.joiningDate || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side Metadata column */}
            <div >
              <Card className="border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-neutral-500" />
                    Security & Authorization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-neutral-400">RBAC Level</p>
                    <Badge variant="secondary" className="font-semibold uppercase tracking-wider text-xs">
                      {employee.role}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Placeholders for secondary tabs */}
        <TabsContent value="attendance">
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Attendance logs</CardTitle>
              <CardDescription>Track monthly hours worked, late checks, and active timeline metrics.</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-lg m-6">
              <Clock className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-neutral-500 text-sm">Attendance logs module mapping in progress.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Leave tracking</CardTitle>
              <CardDescription>Leave history, medical records, and pending balance updates.</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-lg m-6">
              <Calendar className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-neutral-500 text-sm">Leave allocation ledger in development.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Compensation records</CardTitle>
              <CardDescription>Review salary structure, past transactions, and download monthly payslips.</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-lg m-6">
              <CreditCard className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-neutral-500 text-sm">Secured Payroll workspace connection loading.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Security vault</CardTitle>
              <CardDescription>View, upload, and update corporate compliance agreements and IDs.</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-lg m-6">
              <FileSpreadsheet className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-neutral-500 text-sm">Secure storage directory syncing...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Platform Audit</CardTitle>
              <CardDescription>Authorized activities, login events, and update sequences.</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-lg m-6">
              <Activity className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-neutral-500 text-sm">System diagnostic metrics in sync.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}