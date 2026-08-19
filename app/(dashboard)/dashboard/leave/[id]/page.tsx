import { notFound } from "next/navigation";
import { fetchLeaveRequest } from "@/lib/data/leave";
import { LeaveDetailsClient } from "./leave-details-client";

export const dynamic = "force-dynamic";

interface LeaveDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeaveDetailsPage({
  params,
}: LeaveDetailsPageProps) {
  const { id } = await params;
  const leaveRequest = await fetchLeaveRequest(id);

  if (!leaveRequest) {
    notFound();
  }

  return <LeaveDetailsClient data={leaveRequest} />;
}
