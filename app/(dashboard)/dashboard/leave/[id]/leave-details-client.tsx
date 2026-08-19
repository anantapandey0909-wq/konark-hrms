"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LeaveDetails } from "@/components/leave/leave-details";
import type { LeaveRequest, LeaveBalance } from "@/types/leave";
import {
  approveLeave,
  rejectLeave,
  fetchLeaveBalance,
} from "@/lib/data/leave";

interface LeaveDetailsClientProps {
  readonly data: LeaveRequest;
}

export function LeaveDetailsClient({ data }: LeaveDetailsClientProps) {
  const router = useRouter();
  const [isActionLoading, setIsActionLoading] = React.useState(false);
  const [balance, setBalance] = React.useState<LeaveBalance | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const b = await fetchLeaveBalance(data.employeeId);
        if (!cancelled) setBalance(b);
      } catch {
        if (!cancelled) setBalance(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data.employeeId]);

  const handleApprove = async () => {
    setIsActionLoading(true);
    try {
      await approveLeave(data.id);
      toast.success("Leave request approved.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve leave."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    setIsActionLoading(true);
    try {
      await rejectLeave(data.id);
      toast.success("Leave request rejected.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject leave."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {balance && (
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pt-4">
          <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground flex flex-wrap gap-4">
            <span>
              Casual: <strong className="text-foreground">{balance.casualLeave}</strong>
            </span>
            <span>
              Sick: <strong className="text-foreground">{balance.sickLeave}</strong>
            </span>
            <span>
              Earned: <strong className="text-foreground">{balance.earnedLeave}</strong>
            </span>
            <span>
              Comp-off: <strong className="text-foreground">{balance.compOff}</strong>
            </span>
          </div>
        </div>
      )}
      <LeaveDetails
        data={data}
        onApprove={handleApprove}
        onReject={handleReject}
        isActionLoading={isActionLoading}
      />
    </div>
  );
}
