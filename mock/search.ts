import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";
import type { Attendance } from "@/types/attendance";
import type { LeaveRequest } from "@/types/leave";
import type { PayrollRecord } from "@/types/payroll";
import type { SupportTicket } from "@/types/support";
import type { SearchResult } from "@/types/search";

import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";
import { mockAttendances } from "@/mock/attendance";
import { mockLeaveRequests } from "@/mock/leave";
import { mockPayrollRecords } from "@/mock/payroll";
import { mockSupportTickets } from "@/mock/support";

const normalizeEmployee = (employee: Employee): SearchResult => {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  return {
    id: employee.id,
    title: fullName,
    subtitle: employee.designation,
    category: "employees",
    url: `/dashboard/employees/${employee.id}`,
    metadata: {
      employeeId: employee.employeeId,
      email: employee.email,
      phone: employee.phone ?? "",
      status: employee.status,
    },
  };
};

const normalizeDepartment = (dept: Department): SearchResult => {
  return {
    id: dept.id,
    title: dept.name,
    subtitle: dept.code,
    category: "departments",
    url: `/dashboard/departments/${dept.id}`,
    metadata: {
      description: dept.description ?? "",
      status: dept.status,
      budget: dept.budget ?? 0,
    },
  };
};

const normalizeAttendance = (record: Attendance): SearchResult => {
  const employee = mockEmployees.find((emp) => emp.id === record.employeeId);
  const employeeName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : "Unknown Employee";

  return {
    id: record.id,
    title: employeeName,
    subtitle: `Attendance - ${record.attendanceDate}`,
    category: "attendance",
    url: "/dashboard/attendance",
    metadata: {
      employeeId: record.employeeId,
      status: record.status,
      attendanceDate: record.attendanceDate,
    },
  };
};

const normalizeLeave = (request: LeaveRequest): SearchResult => {
  const employee = mockEmployees.find((emp) => emp.id === request.employeeId);
  const employeeName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : "Unknown Employee";

  return {
    id: request.id,
    title: employeeName,
    subtitle: `Leave Request - ${request.leaveType}`,
    category: "leave",
    url: "/dashboard/leave",
    metadata: {
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      status: request.status,
      reason: request.reason ?? "",
    },
  };
};

const normalizePayroll = (record: PayrollRecord): SearchResult => {
  const employee = mockEmployees.find((emp) => emp.id === record.employeeId);
  const employeeName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : "Unknown Employee";

  return {
    id: record.id,
    title: employeeName,
    subtitle: `Payroll Statement - ${record.month} ${record.year}`,
    category: "payroll",
    url: "/dashboard/payroll",
    metadata: {
      employeeId: record.employeeId,
      month: record.month,
      year: record.year,
      status: record.status,
       netSalary: record.salaryBreakdown.netSalary,
      generatedAt: record.generatedAt ?? "",
    },
  };
};

const normalizeTicket = (ticket: SupportTicket): SearchResult => {
  return {
    id: ticket.id,
    title: ticket.subject,
    subtitle: `Ticket #${ticket.ticketNumber} (${ticket.status})`,
    category: "support",
    url: `/dashboard/support/${ticket.id}`,
    metadata: {
      ticketNumber: ticket.ticketNumber,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description ?? "",
    },
  };
};

const employeeResults = mockEmployees.map(normalizeEmployee);
const departmentResults = mockDepartments.map(normalizeDepartment);
const attendanceResults = mockAttendances.map(normalizeAttendance);
const leaveResults = mockLeaveRequests.map(normalizeLeave);
const payrollResults = mockPayrollRecords.map(normalizePayroll);
const supportResults = mockSupportTickets.map(normalizeTicket);

export const searchDataset: SearchResult[] = [
  ...employeeResults,
  ...departmentResults,
  ...attendanceResults,
  ...leaveResults,
  ...payrollResults,
  ...supportResults,
];