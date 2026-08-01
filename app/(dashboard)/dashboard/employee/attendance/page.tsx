import type { Metadata } from "next";
import { EmployeeAttendance } from "@/components/employee-portal/attendance/employee-attendance";

export const metadata: Metadata = {
  title: "My Attendance | Konark HRMS",
  description:
    "View login hours, attendance trends, shift details, and punch logs.",
};

export default function EmployeeAttendancePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeAttendance />
    </div>
  );
}