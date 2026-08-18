"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LeaveDetails } from "@/components/leave/leave-details";
import type { LeaveRequest } from "@/types/leave";
import { approveLeave, rejectLeave } from "@/lib/data/leave";

interface LeaveDetailsClientProps {
  readonly data: LeaveRequest;
}

export function LeaveDetailsClient({ data }: LeaveDetailsClientProps) {
  const router = useRouter();
  const [isActionLoading, setIsActionLoading] = React.useState(false);

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
    <LeaveDetails
      data={data}
      onApprove={handleApprove}
      onReject={handleReject}
      isActionLoading={isActionLoading}
    />
  );
}
