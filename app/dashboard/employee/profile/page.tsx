import type { Metadata } from "next";
import { EmployeeProfile } from "@/components/employee-portal/profile/employee-profile";

export const metadata: Metadata = {
  title: "My Profile | Konark HRMS",
  description:
    "View personal, employment, and compliance information.",
};

export default function EmployeeProfilePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeProfile />
    </div>
  );
}