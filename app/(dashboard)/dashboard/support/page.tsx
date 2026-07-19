import { Metadata } from "next";
import { SupportDashboard } from "@/components/support/support-dashboard";

export const metadata: Metadata = {
  title: "Support Center | Konark HRMS",
  description: "Manage corporate IT assistance pipelines, employee tickets, and service desk operations.",
};

export default function SupportPage() {
  return (
    <div className="container mx-auto py-6">
      <SupportDashboard />
    </div>
  );
}