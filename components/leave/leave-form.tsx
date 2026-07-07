"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { LeaveFormData } from "@/types/leave";
import { mockEmployees } from "@/mock/employee";
import { mockLeaveBalances } from "@/mock/leave";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface LeaveFormProps {
  mode: "create" | "edit";
  initialData?: LeaveFormData | null;
  isLoading?: boolean;
  onSubmit: (data: LeaveFormData) => void;
  onCancel: () => void;
}

/**
 * Calculates derived calendar days from start and end dates.
 */
function calculateDuration(
  startDate: string,
  endDate: string,
  isHalfDay: boolean
): number {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return 0;
  }

  if (isHalfDay && startDate === endDate) {
    return 0.5;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

/**
 * Validates form parameters outside the render lifecycle.
 */
function validateLeaveForm(data: LeaveFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.employeeId) {
    errors.employeeId = "Employee selection is required.";
  }
  if (!data.leaveType) {
    errors.leaveType = "Leave type configuration is required.";
  }
  if (!data.startDate) {
    errors.startDate = "Start date is required.";
  }
  if (!data.endDate) {
    errors.endDate = "End date is required.";
  }
  if (!data.reason || data.reason.trim().length === 0) {
    errors.reason = "A valid reason for the leave is required.";
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start > end) {
      errors.endDate = "End date cannot be prior to start date.";
    }
  }

  if (data.isHalfDay && !data.halfDaySession) {
    errors.halfDaySession = "Half day session selection is required.";
  }

  return errors;
}

const DEFAULT_FORM_STATE: LeaveFormData = {
  employeeId: "",
  leaveType: "",
  startDate: "",
  endDate: "",
  isHalfDay: false,
  halfDaySession: "",
  reason: "",
  notes: "",
  duration: 0,
};

export default function LeaveForm({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onCancel,
}: LeaveFormProps) {
  const [formData, setFormData] = useState<LeaveFormData>(() => {
    return initialData || DEFAULT_FORM_STATE;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  console.log("Initial Employee ID:", formData.employeeId);

console.log(
  "Employee Found:",
  mockEmployees.find((emp) => emp.id === formData.employeeId)
);

  // Direct mock lookup definitions inside presentation layer for Sprint 5
  const selectedEmployee = useMemo(() => {
    return mockEmployees.find((emp) => emp.id === formData.employeeId) || null;
  }, [formData.employeeId]);

  const activeBalance = useMemo(() => {
    const match = mockLeaveBalances.find((bal) => bal.employeeId === formData.employeeId);
    if (match) return match;

    // Clean, structured presentational fallback for unconfigured IDs
    return {
      employeeId: formData.employeeId,
      casualLeave: 0,
      sickLeave: 0,
      earnedLeave: 0,
      maternityLeave: 0,
      paternityLeave: 0,
      compOff: 0,
    };
  }, [formData.employeeId]);

  const calculatedDuration = useMemo(() => {
    return calculateDuration(formData.startDate, formData.endDate, formData.isHalfDay);
  }, [formData.startDate, formData.endDate, formData.isHalfDay]);

  const handleFieldChange = <K extends keyof LeaveFormData>(
    field: K,
    value: LeaveFormData[K]
  ) => {
    setFormData((prev) => {
      const nextState = { ...prev, [field]: value };
      
      // Automatically sync boundary limits if configured as single-day half leave
      if (field === "isHalfDay" && value === true && nextState.startDate) {
        nextState.endDate = nextState.startDate;
      }

      return nextState;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const validationErrors = validateLeaveForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Direct synchronous callback execution
    onSubmit({
      ...formData,
      duration: calculatedDuration,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Header block */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "New Leave Request" : "Edit Leave Request"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Draft and submit a new leave request for workflow authorization."
              : "Modify the properties of an existing leave request."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fields Form Layout Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identity Parameters */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Employee Identity
              </CardTitle>
              <CardDescription>
                Assign this request to a team member to fetch profile metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-sm font-medium">
                    Employee Name <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    disabled={isLoading || mode === "edit"}
                    value={formData.employeeId}
                    onValueChange={(value) => handleFieldChange("employeeId", value)}
                  >
                    <SelectTrigger id="employeeId" className="w-full">
                      <SelectValue placeholder="Select active employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeId && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.employeeId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeCode" className="text-sm font-medium text-muted-foreground">
                    Employee ID
                  </Label>
                  <Input
                    id="employeeCode"
                    value={selectedEmployee?.employeeCode || ""}
                    placeholder="—"
                    readOnly
                    disabled
                    className="bg-muted/50 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-muted-foreground">
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={selectedEmployee?.department || ""}
                    placeholder="—"
                    readOnly
                    disabled
                    className="bg-muted/50 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager" className="text-sm font-medium text-muted-foreground">
                    Reporting Manager
                  </Label>
                  <Input
                    id="manager"
                    value={selectedEmployee?.managerName || ""}
                    placeholder="—"
                    readOnly
                    disabled
                    className="bg-muted/50 cursor-not-allowed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Configuration Parameters */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Schedule Parameters
              </CardTitle>
              <CardDescription>
                Configure the dynamic type, intervals, and modifiers of the leave request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="leaveType" className="text-sm font-medium">
                    Leave Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    disabled={isLoading}
                    value={formData.leaveType}
                    onValueChange={(value) => handleFieldChange("leaveType", value as LeaveFormData["leaveType"])}
                  >
                    <SelectTrigger id="leaveType">
                      <SelectValue placeholder="Choose standard leave type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASUAL_LEAVE">Casual Leave</SelectItem>
                      <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                      <SelectItem value="EARNED_LEAVE">Earned Leave</SelectItem>
                      <SelectItem value="MATERNITY_LEAVE">Maternity Leave</SelectItem>
                      <SelectItem value="PATERNITY_LEAVE">Paternity Leave</SelectItem>
                      <SelectItem value="WORK_FROM_HOME">Work From Home</SelectItem>
                      <SelectItem value="HALF_DAY">Half Day</SelectItem>
                      <SelectItem value="COMP_OFF">Compensatory Off (Comp Off)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.leaveType && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.leaveType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    disabled={isLoading}
                    value={formData.startDate}
                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                    className="w-full"
                  />
                  {errors.startDate && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    disabled={isLoading || formData.isHalfDay}
                    value={formData.isHalfDay ? formData.startDate : formData.endDate}
                    onChange={(e) => handleFieldChange("endDate", e.target.value)}
                    className="w-full"
                  />
                  {errors.endDate && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.endDate}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 py-3 md:col-span-2">
                  <Switch
                    id="isHalfDay"
                    disabled={isLoading}
                    checked={formData.isHalfDay}
                    onCheckedChange={(checked) => handleFieldChange("isHalfDay", checked)}
                  />
                  <Label htmlFor="isHalfDay" className="text-sm font-medium cursor-pointer">
                    Configure as Half Day Leave
                  </Label>
                </div>

                {formData.isHalfDay && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="halfDaySession" className="text-sm font-medium">
                      Half Day Session Designation <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      disabled={isLoading}
                      value={formData.halfDaySession}
                      onValueChange={(value) => handleFieldChange("halfDaySession", value as LeaveFormData["halfDaySession"])}
                    >
                      <SelectTrigger id="halfDaySession">
                        <SelectValue placeholder="Identify targeted session interval..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIRST_HALF">First Half (Morning Session)</SelectItem>
                        <SelectItem value="SECOND_HALF">Second Half (Afternoon Session)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.halfDaySession && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.halfDaySession}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-muted-foreground">
                    Derived Duration (Days)
                  </Label>
                  <Input
                    id="duration"
                    value={calculatedDuration}
                    readOnly
                    disabled
                    className="bg-muted/50 font-mono font-medium cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="reason" className="text-sm font-medium">
                    Reason for Request <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reason"
                    disabled={isLoading}
                    value={formData.reason}
                    onChange={(e) => handleFieldChange("reason", e.target.value)}
                    placeholder="Provide professional context for leaving..."
                  />
                  {errors.reason && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.reason}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supporting Upload Fields (Presentational Area) */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Supporting Documentation
              </CardTitle>
              <CardDescription>
                Upload dynamic assets such as medical certifications or event notices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/10">
                <FileText className="w-8 h-8 text-muted-foreground/60 mb-2" />
                <span className="text-sm font-medium text-muted-foreground">
                  Enterprise File Upload Pipeline
                </span>
                <span className="text-xs text-muted-foreground/80 mt-1">
                  Supabase Storage integration will mount automatically in downstream sprints.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Supplementary Information Notes */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Additional Annotations
              </CardTitle>
              <CardDescription>
                Supply supplemental operating notes or comments for management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Internal Remarks
                </Label>
                <Textarea
                  id="notes"
                  disabled={isLoading}
                  value={formData.notes || ""}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  placeholder="Record operational details..."
                  className="min-h-[100px] resize-y"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submission and Action Blocks */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onCancel}
              className="px-4"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="px-5">
              {isLoading ? "Saving Parameters..." : mode === "create" ? "Submit Request" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Sidebar Cards Column */}
        <div className="space-y-6">
          
          {/* Balance Cards Panel */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                Leave Balances
              </CardTitle>
              <CardDescription>
                Verified allocations associated with the selected profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!formData.employeeId ? (
                <div className="text-sm text-muted-foreground/80 py-4 text-center">
                  Select a team member to analyze individual balance limits.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Casual Leave</span>
                      <span className="font-mono font-semibold text-foreground">{activeBalance.casualLeave} Days</span>
                    </div>
                    <Separator className="opacity-60" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Sick Leave</span>
                      <span className="font-mono font-semibold text-foreground">{activeBalance.sickLeave} Days</span>
                    </div>
                    <Separator className="opacity-60" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Earned Leave</span>
                      <span className="font-mono font-semibold text-foreground">{activeBalance.earnedLeave} Days</span>
                    </div>
                    <Separator className="opacity-60" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Maternity Leave</span>
                      <span className="font-mono font-semibold text-foreground">{activeBalance.maternityLeave} Days</span>
                    </div>
                    <Separator className="opacity-60" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Paternity Leave</span>
                      <span className="font-mono font-semibold text-foreground">{activeBalance.paternityLeave} Days</span>
                    </div>
                    <Separator className="opacity-60" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Comp Off Balance</span>
                      <span className="font-mono font-semibold text-foreground">{activeBalance.compOff} Days</span>
                    </div>
                    <Separator className="opacity-60" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow Chain Preview */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Approval Progression
              </CardTitle>
              <CardDescription>
                Overview of authorization steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                {/* Step 1 */}
                <div className="relative space-y-1">
                  <div className="absolute left-[-21px] top-1 flex items-center justify-center w-[12px] h-[12px] rounded-full border-2 border-background bg-primary" />
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Direct Supervisor Review</span>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
                      Primary
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Assessed automatically by reporting manager coordinates.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative space-y-1">
                  <div className="absolute left-[-21px] top-1 flex items-center justify-center w-[12px] h-[12px] rounded-full border-2 border-background bg-muted" />
                  <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
                    <span>HR Operations Group</span>
                    <Badge variant="secondary" className="text-[10px] uppercase font-mono px-1.5 py-0">
                      Secondary
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground/80 leading-normal">
                    Final configuration review and ledger record updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}