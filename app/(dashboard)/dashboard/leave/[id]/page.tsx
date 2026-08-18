import { notFound } from "next/navigation";
import { LeaveDetails } from "@/components/leave/leave-details";
import { fetchLeaveRequest } from "@/lib/data/leave";

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

  return <LeaveDetails data={leaveRequest} />;
}
