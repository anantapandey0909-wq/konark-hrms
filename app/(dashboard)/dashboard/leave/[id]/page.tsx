import { notFound } from "next/navigation";
import { mockLeaveRequests } from "@/mock/leave";
import { LeaveDetails } from "@/components/leave/leave-details";

interface LeaveDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeaveDetailsPage({
  params,
}: LeaveDetailsPageProps) {
  const { id } = await params;

  // Retrieve the matching leave request from the unified mock dataset
  const leaveRequest = mockLeaveRequests.find(
    (request) => request.id === id
  );

  // Fall back to Next.js standard 404 if no record matches
  if (!leaveRequest) {
    notFound();
  }

  return (
    <LeaveDetails
      data={leaveRequest}
    
    />
  );
}