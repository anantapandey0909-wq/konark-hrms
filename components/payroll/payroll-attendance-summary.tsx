import * as React from "react";
import { Calendar } from "lucide-react";
import { PayrollRecord } from "@/types/payroll";

export function PayrollAttendanceSummary({ record }: { readonly record: PayrollRecord }) {
  const att = record.attendanceSummary;

  const items = [
    { label: "Working Days", value: att.workingDays },
    { label: "Present Days", value: att.presentDays, color: "text-emerald-600 font-bold" },
    { label: "Absent Days", value: att.absentDays, color: att.absentDays > 0 ? "text-rose-600 font-bold" : "" },
    { label: "Paid Leave Days", value: att.paidLeaveDays },
    { label: "Unpaid Leave Days", value: att.unpaidLeaveDays },
    { label: "Overtime Hours", value: `${att.overtimeHours} hrs` },
    { label: "Late Entries", value: att.lateEntries },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-900">
        <Calendar className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Attendance Summary</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{item.label}</span>
            <span className={item.color || "font-medium text-slate-900 dark:text-slate-100"}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}