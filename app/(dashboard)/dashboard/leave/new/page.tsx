"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LeaveForm } from "@/components/leave/leave-form";
import type { LeaveFormData } from "@/types/leave";
import { saveLeaveRequest } from "@/lib/data/leave";

export default function NewLeavePage() {
  const router = useRouter();

  const handleSubmit = async (data: LeaveFormData) => {
    try {
      await saveLeaveRequest(data);
      toast.success("Leave request submitted.");
      router.push("/dashboard/leave");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit leave request."
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6">
      <LeaveForm mode="create" onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
