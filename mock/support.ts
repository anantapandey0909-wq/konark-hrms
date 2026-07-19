import { mockEmployees } from "@/mock/employee";
import type { SupportTicket } from "@/types/support";

const employees = mockEmployees.slice(0, 10);

const subjects = [
  "Attendance not marked",
  "Leave request approval pending",
  "Incorrect salary calculation",
  "Unable to login",
  "Profile information update",
  "Document verification issue",
  "Department transfer request",
  "Bank details update",
  "Forgot password",
  "Payslip download issue",
] as const;

const descriptions = [
  "Attendance for yesterday is missing.",
  "Leave request is awaiting manager approval.",
  "Salary calculation appears incorrect for this month.",
  "Unable to access the HRMS portal.",
  "Need to update personal information.",
  "Uploaded document is still pending verification.",
  "Requesting department reassignment.",
  "Need to update bank account details.",
  "Password reset link is not working.",
  "Unable to download salary slip.",
] as const;

const categories: SupportTicket["category"][] = [
  "ATTENDANCE",
  "LEAVE",
  "PAYROLL",
  "ACCOUNT_ACCESS",
  "EMPLOYEE_PROFILE",
  "DOCUMENTS",
  "DEPARTMENT",
  "GENERAL",
  "IT_SUPPORT",
  "PAYROLL",
];

const priorities: SupportTicket["priority"][] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const statuses: SupportTicket["status"][] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_EMPLOYEE",
  "RESOLVED",
  "CLOSED",
];

export const mockSupportTickets: SupportTicket[] = employees.map(
  (employee, index) => ({
    id: `support-${index + 1}`,

    ticketNumber: `SUP-${String(index + 1).padStart(4, "0")}`,

    subject: subjects[index % subjects.length],

    description: descriptions[index % descriptions.length],

    employeeId: employee.id,

    employeeName: employee.fullName,

    employeeAvatar: employee.avatar ?? undefined,

    // Employee.department is a string in your project
    department: employee.department,

    category: categories[index % categories.length],

    priority: priorities[index % priorities.length],

    status: statuses[index % statuses.length],

    assignedTo: "HR Administrator",

    resolutionNotes:
      statuses[index % statuses.length] === "RESOLVED" ||
      statuses[index % statuses.length] === "CLOSED"
        ? "Issue resolved successfully."
        : undefined,

    createdAt: new Date(2026, 6, index + 1).toISOString(),

    updatedAt: new Date(2026, 6, index + 2).toISOString(),

    timeline: [
      {
        id: `timeline-${index + 1}`,
        title: "Ticket Created",
        description: "Support ticket has been created.",
        createdAt: new Date(2026, 6, index + 1).toISOString(),
        createdBy: employee.fullName,
      },
    ],
  })
);

export const getSupportTicketById = (
  id: string
): SupportTicket | undefined => {
  return mockSupportTickets.find((ticket) => ticket.id === id);
};

export const getOpenSupportTickets = (): SupportTicket[] => {
  return mockSupportTickets.filter(
    (ticket) => ticket.status === "OPEN"
  );
};

export const getResolvedSupportTickets = (): SupportTicket[] => {
  return mockSupportTickets.filter(
    (ticket) =>
      ticket.status === "RESOLVED" ||
      ticket.status === "CLOSED"
  );
};

export const supportSummary = {
  get totalTickets(): number {
    return mockSupportTickets.length;
  },

  get openTickets(): number {
    return mockSupportTickets.filter(
      (ticket) => ticket.status === "OPEN"
    ).length;
  },

  get inProgressTickets(): number {
    return mockSupportTickets.filter(
      (ticket) => ticket.status === "IN_PROGRESS"
    ).length;
  },

  get waitingTickets(): number {
    return mockSupportTickets.filter(
      (ticket) => ticket.status === "WAITING_FOR_EMPLOYEE"
    ).length;
  },

  get resolvedTickets(): number {
    return mockSupportTickets.filter(
      (ticket) =>
        ticket.status === "RESOLVED" ||
        ticket.status === "CLOSED"
    ).length;
  },
};