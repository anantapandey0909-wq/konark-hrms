"use client";

import * as React from "react";
import { useRouter, notFound } from "next/navigation";
import { SupportForm } from "@/components/support/support-form";
import { mockSupportTickets } from "@/mock/support";
import type { SupportEmployee } from "@/types/support";

interface EditTicketPageProps {
  params: Promise<{ id: string }>;
}

const mockEmployeesList: SupportEmployee[] = [
  { id: "emp-101", fullName: "Amit Sharma", email: "amit.sharma@konark.com" },
  { id: "emp-102", fullName: "Priya Patel", email: "priya.patel@konark.com" },
  { id: "emp-103", fullName: "Rohan Das", email: "rohan.das@konark.com" },
];

const mockAgentsList: SupportEmployee[] = [
  { id: "agent-201", fullName: "Vikram Malhotra", email: "vikram.m@konark.com" },
  { id: "agent-202", fullName: "Neha Sen", email: "neha.s@konark.com" },
];

export default function EditTicketPage({ params }: EditTicketPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const [isLoading, setIsLoading] = React.useState(false);

  const ticket = React.useMemo(() => {
    return mockSupportTickets.find((t) => t.id === id);
  }, [id]);

  React.useEffect(() => {
    if (ticket) {
      document.title = `Edit Ticket #${ticket.ticketNumber} | Konark HRMS`;
    }
  }, [ticket]);

  if (!ticket) {
    notFound();
  }

  const handleSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      // TODO: Replace with updateTicket() API call during backend integration phase
      console.log("Updating ticket with payload:", data);
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(`/dashboard/support/${ticket.id}`);
    } catch (error) {
      console.error("Failed to update support ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/support/${ticket.id}`);
  };

  return (
    <div className="container mx-auto max-w-3xl py-6 space-y-6">
      <div className="space-y-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Support Ticket
        </h1>
        <p className="text-sm text-muted-foreground">
          Modify the priority, category or diagnostic status parameters of support ticket #{ticket.ticketNumber}.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <SupportForm
          initialData={ticket}
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