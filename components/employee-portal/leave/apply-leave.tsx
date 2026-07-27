"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Calendar } from "lucide-react";

interface LeaveBalanceItem {
  id: string;
  name: string;
  type: string;
  allocated: number;
  used: number;
}

interface ApplyLeaveProps {
  readonly balances: readonly LeaveBalanceItem[];
}

export function ApplyLeave({ balances }: ApplyLeaveProps) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      toast.error("Validation Error", {
        description: "Please populate all fields in order to initiate a request.",
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success("Request Submitted", {
        description: `Your request for ${leaveType} has been successfully compiled into the verification workflow.`,
      });
      // Reset local simulation
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setSubmitting(false);
    }, 1200);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-slate-400" />
          Request Leave (Self-Service)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Leave Type</label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {balances.map((bal) => (
                    <SelectItem key={bal.id} value={bal.name}>
                      {bal.name} ({bal.allocated - bal.used} left)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Reason for Request</label>
            <Textarea
              placeholder="Provide context regarding requested PTO..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={submitting} className="min-w-[120px]">
              {submitting ? "Processing..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}