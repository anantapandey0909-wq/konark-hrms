"use client";

import React from "react";
import {
  User,
  Calendar,
  FileText,
  Paperclip,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Info,
  ArrowLeft,
  Edit,
  ShieldAlert
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import LeaveStatusBadge from "@/components/leave/leave-status-badge";
import type { LeaveRequest } from "@/types/leave";

// ==================================================
// TYPES & INTERFACES
// ==================================================

export interface LeaveDetailsProps {
  data: LeaveRequest;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  isActionLoading?: boolean;
}

interface DetailSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface PlaceholderBlockProps {
  label: string;
  value?: React.ReactNode;
}

// ==================================================
// SHARED STYLES & CONSTANTS
// ==================================================

const STYLES = {
  card: "bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-950 dark:border-neutral-800",
  sectionPadding: "p-6",
  gridLabel: "text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500",
  gridValue: "text-sm font-medium text-neutral-800 dark:text-neutral-200 mt-1"
};

// ==================================================
// REUSABLE HELPER COMPONENTS
// ==================================================

const DetailSection: React.FC<DetailSectionProps> = ({ title, icon, children }) => (
  <section 
    className={`${STYLES.card} divide-y divide-neutral-100 dark:divide-neutral-900`}
    aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
  >
    <div className="px-6 py-4 flex items-center gap-2.5 bg-neutral-50/50 dark:bg-neutral-900/10">
      <span className="text-neutral-500 dark:text-neutral-400" aria-hidden="true">{icon}</span>
      <h3 
        id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-100 uppercase"
      >
        {title}
      </h3>
    </div>
    <div className={STYLES.sectionPadding}>
      {children}
    </div>
  </section>
);

const PlaceholderBlock: React.FC<PlaceholderBlockProps> = ({ label, value }) => (
  <div className="space-y-1">
    <span className={STYLES.gridLabel}>{label}</span>
    <div className={STYLES.gridValue}>
      {value !== undefined && value !== "" ? (
        value
      ) : (
        <span className="text-neutral-400 dark:text-neutral-600 font-normal">Not provided</span>
      )}
    </div>
  </div>
);

const IntegrationPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-4 py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/30 dark:bg-neutral-950/20">
    <Info className="h-5 w-5 text-neutral-400 dark:text-neutral-600 mb-2" aria-hidden="true" />
    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
      This information will be available after backend integration.
    </p>
  </div>
);

// ==================================================
// MAIN COMPONENT
// ==================================================

export const LeaveDetails: React.FC<LeaveDetailsProps> = ({
  data,
  
  onEdit,
  onApprove,
  onReject,
  isActionLoading = false
}) => {
const router = useRouter();
  // Format Dates safely whether they are Date objects or strings
  const formatLeaveDate = (dateVal?: string | Date): string => {
    if (!dateVal) return "N/A";
    if (dateVal instanceof Date) {
      return dateVal.toISOString().split("T")[0];
    }
    return String(dateVal);
  };

  const formattedStartDate = formatLeaveDate(data.startDate);
  const formattedEndDate = formatLeaveDate(data.endDate);

  const displayStatus = String(data.status || "PENDING").toUpperCase();
  const isPending = displayStatus === "PENDING";

  // ------------------------------------------------
  // RENDER HELPERS
  // ------------------------------------------------

  const renderHeader = () => (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Leave Request Details
          </h1>
          <span className="text-sm font-mono px-2.5 py-0.5 rounded bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
            {data.id}
          </span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          View complete leave request information.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-center">
        <LeaveStatusBadge status={data.status} />
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
      <Button
        variant="outline"
        onClick={() => router.back()}
        disabled={isActionLoading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
        aria-label="Back to Leave List"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {onEdit && isPending && (
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={isActionLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
            aria-label="Edit Leave Request"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}

        {isPending && (
          <>
            {onReject && (
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={isActionLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
                aria-label="Reject Leave Request"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            )}
            {onApprove && (
              <Button
                onClick={onApprove}
                disabled={isActionLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
                aria-label="Approve Leave Request"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            )}
          </>
        )}
      </div>
    </footer>
  );

  // ------------------------------------------------
  // MAIN RENDER
  // ------------------------------------------------

  return (
    <article className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {renderHeader()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ==========================================
            LEFT COLUMN (2 COLS DESKTOP)
            ========================================== */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: Employee Information */}
          <DetailSection title="Employee Information" icon={<User className="h-4 w-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PlaceholderBlock label="Employee ID" value={data.employeeId} />
              <PlaceholderBlock label="Contract Status" value="Active Staff" />
            </div>
          </DetailSection>

          {/* SECTION 2: Leave Information */}
          <DetailSection title="Leave Information" icon={<Calendar className="h-4 w-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <PlaceholderBlock label="Leave Type" value={data.leaveType} />
              <PlaceholderBlock label="Duration" value={`${formattedStartDate} to ${formattedEndDate}`} />
              <PlaceholderBlock label="Total Days" value={`${data.totalDays} Day${data.totalDays > 1 ? "s" : ""}`} />
            </div>
          </DetailSection>

          {/* SECTION 3: Reason */}
          <DetailSection title="Reason" icon={<FileText className="h-4 w-4" />}>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {data.reason || "No reason specified."}
            </p>
          </DetailSection>

          {/* SECTION 4: Supporting Documents */}
          <DetailSection title="Supporting Documents" icon={<Paperclip className="h-4 w-4" />}>
            <IntegrationPlaceholder />
          </DetailSection>

          {/* SECTION 5: Notes */}
          <DetailSection title="Notes" icon={<Info className="h-4 w-4" />}>
            <IntegrationPlaceholder />
          </DetailSection>

        </div>

        {/* ==========================================
            RIGHT SIDEBAR (1 COL DESKTOP)
            ========================================== */}
        <aside className="space-y-6" aria-label="Leave Metrics and Audit Trail">

          {/* SECTION 6: Leave Balance */}
          <DetailSection title="Leave Balance" icon={<Clock className="h-4 w-4" />}>
            <IntegrationPlaceholder />
          </DetailSection>

          {/* SECTION 7: Approval Information */}
          <DetailSection title="Approval Information" icon={<CheckCircle2 className="h-4 w-4" />}>
            <IntegrationPlaceholder />
          </DetailSection>

          {/* SECTION 8: Timeline */}
          <DetailSection title="Timeline" icon={<History className="h-4 w-4" />}>
            <IntegrationPlaceholder />
          </DetailSection>

          {/* SECTION 9: Audit Information */}
          <DetailSection title="Audit Information" icon={<ShieldAlert className="h-4 w-4" />}>
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">System ID:</span>
                <span className="font-mono text-neutral-600 dark:text-neutral-400">{data.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Security Scope:</span>
                <span className="font-semibold text-neutral-600 dark:text-neutral-400">RESTRICTED_ACCESS</span>
              </div>
            </div>
            </DetailSection>
      </aside>
    </div>

    {renderFooter()}
    </article>
  );
}
