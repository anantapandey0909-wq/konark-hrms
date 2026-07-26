import type { SupportTicket } from "@/types/support";
import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";

interface EmployeeDetails {
  name: string;
  avatarUrl?: string;
  departmentName: string;
}

const getEmployeeDetails = (employeeId: string): EmployeeDetails => {
  const employee = mockEmployees.find((emp) => emp.id === employeeId);
  if (!employee) {
    return {
      name: "Unknown Employee",
      departmentName: "Unknown Department",
    };
  }
  const department = mockDepartments.find((d) => d.id === employee.departmentId);
  return {
    name: `${employee.firstName} ${employee.lastName}`,
    avatarUrl: employee.avatarUrl ?? undefined,
    departmentName: department?.name ?? "Unknown Department",
  };
};

const createSupportTicket = (
  id: string,
  ticketNumber: string,
  employeeId: string,
  subject: string,
  description: string,
  category: SupportTicket["category"],
  priority: SupportTicket["priority"],
  status: SupportTicket["status"],
  createdAt: string,
  updatedAt: string
): SupportTicket => {
  const employeeInfo = getEmployeeDetails(employeeId);
  return {
    id,
    ticketNumber,
    employeeId,
    employeeName: employeeInfo.name,
    employeeAvatar: employeeInfo.avatarUrl,
    department: employeeInfo.departmentName,
    subject,
    description,
    category,
    priority,
    status,
    timeline: [],
    createdAt,
    updatedAt,
  };
};

export const mockSupportTickets: SupportTicket[] = [
  createSupportTicket(
    "tkt-1",
    "TKT-1001",
    "emp-101",
    "VPN Access Request",
    "Need VPN access to the staging servers for testing the new release.",
    "ACCOUNT_ACCESS",
    "HIGH",
    "OPEN",
    "2025-01-15T09:00:00.000Z",
    "2025-01-15T09:00:00.000Z"
  ),
  createSupportTicket(
    "tkt-2",
    "TKT-1002",
    "emp-102",
    "Payroll Discrepancy",
    "My January allowance is missing from the recent draft statement.",
    "PAYROLL",
    "MEDIUM",
    "IN_PROGRESS",
    "2025-01-14T10:30:00.000Z",
    "2025-01-15T11:00:00.000Z"
  ),
  createSupportTicket(
    "tkt-3",
    "TKT-1003",
    "emp-103",
    "Maternity Leave Document Submission",
    "Uploading the official medical documents for maternity leave clearance.",
    "LEAVE",
    "LOW",
    "RESOLVED",
    "2025-01-10T14:00:00.000Z",
    "2025-01-12T16:00:00.000Z"
  ),
  createSupportTicket(
    "tkt-4",
    "TKT-1004",
    "emp-104",
    "New Laptop Provisioning",
    "My current MacBook is overheating under load. Requesting a replacement.",
    "IT_SUPPORT",
    "HIGH",
    "OPEN",
    "2025-01-15T13:45:00.000Z",
    "2025-01-15T13:45:00.000Z"
  ),
  createSupportTicket(
    "tkt-5",
    "TKT-1005",
    "emp-105",
    "Hiring Portal Access",
    "Unable to log in to the ATS recruiting portal. Password reset failed.",
    "ACCOUNT_ACCESS",
    "MEDIUM",
    "CLOSED",
    "2025-01-08T08:30:00.000Z",
    "2025-01-09T10:00:00.000Z"
  ),
];