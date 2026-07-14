"use client";

import { use } from "react";
import { useRouter, notFound } from "next/navigation";

import { mockLeaveRequests } from "@/mock/leave";
import { mapLeaveRequestToForm } from "@/lib/leave/mapLeaveRequestToForm";
import LeaveForm from "@/components/leave/leave-form";
import type { LeaveFormData } from "@/types/leave";

interface EditLeavePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLeavePage({
  params,
}: EditLeavePageProps) {
  const router = useRouter();

  // Next.js 16: unwrap params Promise
  const { id } = use(params);

  const leaveRequest = mockLeaveRequests.find(
    (request) => request.id === id
  );

  if (!leaveRequest) {
    notFound();
  }

  const initialData = mapLeaveRequestToForm(leaveRequest);

  const handleSubmit = (data: LeaveFormData) => {
    // TODO: Replace with API call during backend integration.
    console.log("Updated Leave Request:", data);

    // Temporary navigation after successful save.
    router.push(`/leave/${id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6">
      <LeaveForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}