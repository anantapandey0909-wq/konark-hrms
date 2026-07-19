"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SupportForm } from "@/components/support/support-form";
import type { SupportEmployee } from "@/types/support";

// Mock employee resources for form lookup in mock sandbox
const mockEmployeesList: SupportEmployee[] = [
  { id: "emp-101", fullName: "Amit Sharma", email: "amit.sharma@konark.com" },
  { id: "emp-102", fullName: "Priya Patel", email: "priya.patel@konark.com" },
  { id: "emp-103", fullName: "Rohan Das", email: "rohan.das@konark.com" },
];

const mockAgentsList: SupportEmployee[] = [
  { id: "agent-201", fullName: "Vikram Malhotra", email: "vikram.m@konark.com" },
  { id: "agent-202", fullName: "Neha Sen", email: "neha.s@konark.com" },
];

export default function CreateSupportTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // Client-side browser tab title synchronization
  React.useEffect(() => {
    document.title = "Create Support Ticket | Konark HRMS";
  }, []);

  const handleSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      // TODO: Replace with createTicket() API call during backend integration phase
      console.log("Creating ticket with payload:", data);
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard/support");
    } catch (error) {
      console.error("Failed to submit support ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/support");
  };

  return (
    <div className="container mx-auto max-w-3xl py-6 space-y-6">
      <div className="space-y-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create Support Ticket
        </h1>
        <p className="text-sm text-muted-foreground">
          Submit a technical help request, payroll discrepancy, or general operational issue.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <SupportForm
          employees={mockEmployeesList}
          agents={mockAgentsList}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}