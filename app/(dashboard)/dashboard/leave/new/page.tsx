"use client";

import { useRouter } from "next/navigation";

import LeaveForm from "@/components/leave/leave-form";
import type { LeaveFormData } from "@/types/leave";

export default function NewLeavePage() {
  const router = useRouter();

  const handleSubmit = (data: LeaveFormData) => {
    // TODO:
    // Replace with API call during backend integration.
    console.log("New Leave Request:", data);

    // Temporary navigation after successful creation.
    router.push("/leave");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6">
      <LeaveForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
