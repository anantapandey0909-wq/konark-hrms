"use client";

import * as React from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { mapLeaveRequestToForm } from "@/lib/leave/mapLeaveRequestToForm";
import { LeaveForm } from "@/components/leave/leave-form";
import type { LeaveFormData, LeaveRequest } from "@/types/leave";
import { fetchLeaveRequest, patchLeaveRequest } from "@/lib/data/leave";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EditLeavePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLeavePage({ params }: EditLeavePageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [leaveRequest, setLeaveRequest] = React.useState<LeaveRequest | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const row = await fetchLeaveRequest(id);
        if (!cancelled) setLeaveRequest(row);
      } catch {
        if (!cancelled) setLeaveRequest(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (data: LeaveFormData) => {
    setSaving(true);
    try {
      await patchLeaveRequest(id, data);
      toast.success("Leave request updated.");
      router.push(`/dashboard/leave/${id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 text-sm text-muted-foreground">
        Loading leave request…
      </div>
    );
  }

  if (!leaveRequest) {
    return (
      <div className="container mx-auto py-6 space-y-4 max-w-3xl">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/leave" className="inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Record Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Leave request <span className="font-mono font-semibold">{id}</span>{" "}
              was not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initialData = mapLeaveRequestToForm(leaveRequest);

  return (
    <div className="container mx-auto py-6">
      {saving && (
        <p className="mb-2 text-xs text-muted-foreground">Saving…</p>
      )}
      <LeaveForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
