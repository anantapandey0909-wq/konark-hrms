"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Briefcase, 
  Clock, 
  User,
  BadgeInfo
} from "lucide-react";
import { PayrollRecord } from "@/types/payroll";
import { mockEmployees } from "@/mock/employee";

export interface PayrollEmployeeInfoProps {
  readonly record: PayrollRecord;
}

function InfoField({ 
  icon: Icon, 
  label, 
  value 
}: { 
  readonly icon: React.ComponentType<{ className?: string }>; 
  readonly label: string; 
  readonly value: string | null | undefined; 
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-50 bg-slate-50/30 p-3 transition-all hover:bg-slate-50 dark:border-slate-800/40 dark:bg-slate-900/10 dark:hover:bg-slate-900/30">
      <Icon className="h-4 w-4 mt-0.5 text-slate-400 dark:text-slate-500" />
      <div className="space-y-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

export function PayrollEmployeeInfo({ record }: PayrollEmployeeInfoProps) {
  // Resolve rich profile details from core employee mock data
  const employeeProfile = React.useMemo(() => {
    return mockEmployees.find((emp) => emp.id === record.employeeId);
  }, [record.employeeId]);

  const initials = React.useMemo(() => {
    return record.employeeName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [record.employeeName]);

  const employmentTypeLabel = React.useMemo(() => {
    if (!employeeProfile?.employmentType) return undefined;
    return employeeProfile.employmentType.replace("_", " ").toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [employeeProfile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-6"
    >
      {/* Header Profile Section */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {employeeProfile?.avatarUrl ? (
          <img
            src={employeeProfile.avatarUrl}
            alt={record.employeeName}
            className="h-16 w-16 rounded-full border border-slate-100 object-cover shadow-sm dark:border-slate-800"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            {initials}
          </div>
        )}

        <div className="space-y-1">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {record.employeeName}
            </h3>
            {employeeProfile?.status && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                employeeProfile.status === "ACTIVE" 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                  : "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
              }`}>
                {employeeProfile.status.replace("_", " ")}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {record.designation}
          </p>
          <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
            {record.employeeCode}
          </p>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoField
          icon={Building2}
          label="Department"
          value={record.department.name}
        />
        <InfoField
          icon={Briefcase}
          label="Employment Type"
          value={employmentTypeLabel}
        />
        <InfoField
          icon={MapPin}
          label="Work Location"
          value={employeeProfile?.workLocation}
        />
        <InfoField
          icon={Calendar}
          label="Joining Date"
          value={employeeProfile?.joiningDate ? new Date(employeeProfile.joiningDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }) : undefined}
        />
        <InfoField
          icon={Mail}
          label="Email Address"
          value={employeeProfile?.email}
        />
        <InfoField
          icon={Phone}
          label="Contact Number"
          value={employeeProfile?.phone}
        />
      </div>

      {/* Metadata Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400 dark:border-slate-900 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>Last Updated: {new Date(record.updatedAt).toLocaleDateString("en-IN")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BadgeInfo className="h-3 w-3" />
          <span>Disbursal: {record.paidAt ? "Disbursed" : "Unpaid"}</span>
        </div>
      </div>
    </motion.div>
  );
}