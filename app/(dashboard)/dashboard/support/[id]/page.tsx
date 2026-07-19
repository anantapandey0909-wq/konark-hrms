"use client";

import * as React from "react";
import { useRouter, notFound } from "next/navigation";
import { SupportDetails } from "@/components/support/support-details";
import { mockSupportTickets } from "@/mock/support";

interface TicketDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailsPage({ params }: TicketDetailsPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const ticket = React.useMemo(() => {
    return mockSupportTickets.find((t) => t.id === id);
  }, [id]);

  React.useEffect(() => {
    if (ticket) {
      document.title = `Ticket #${ticket.ticketNumber} | Konark HRMS`;
    }
  }, [ticket]);

  if (!ticket) {
    notFound();
  }

  const handleEdit = () => {
    router.push(`/dashboard/support/${ticket.id}/edit`);
  };

  const handleBack = () => {
    router.push("/dashboard/support");
  };

  return (
    <div className="container mx-auto py-6">
      <SupportDetails
        ticket={ticket}
        onEdit={handleEdit}
        onBack={handleBack}
      />
    </div>
  );
}