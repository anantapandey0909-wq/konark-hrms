import type { Employee } from "@/types/employee";
import type { ResolvedDepartment } from "@/types/department";
import type { AttendanceRecord } from "@/types/attendance";
import type { LeaveRequest } from "@/types/leave";
import type { PayrollRecord } from "@/types/payroll";
import type { SupportTicket } from "@/types/support";
import type { SearchResult } from "@/types/search";

import { mockEmployees } from "@/mock/employee";
import { mockDepartments } from "@/mock/department";
import { mockAttendanceRecords } from "@/mock/attendance";
import { mockLeaveRequests } from "@/mock/leave";
import { mockPayrollRecords } from "@/mock/payroll";
import { mockSupportTickets } from "@/mock/support";

const normalizeEmployee = (employee: Employee): SearchResult => {
  return {
    id: employee.id,
    title: employee.fullName,
    subtitle: employee.designation,
    category: "employees",
    url: `/dashboard/employees/${employee.id}`,
    metadata: {
      employeeId: employee.employeeId,
      employeeCode: employee.employeeCode,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      status: employee.status,
      location: employee.location
    }
  };
};

const normalizeDepartment = (dept: ResolvedDepartment): SearchResult => {
  return {
    id: dept.id,
    title: dept.name,
    subtitle: dept.code,
    category: "departments",
    url: `/dashboard/departments/${dept.id}`,
    metadata: {
      description: dept.description,
      status: dept.status,
      employeeCount: dept.employeeCount,
      allocatedBudget: dept.budget.allocated,
      utilizedBudget: dept.budget.utilized,
      remainingBudget: dept.budget.remaining,
      currency: dept.budget.currency
    }
  };
};

const normalizeAttendance = (record: AttendanceRecord): SearchResult => {
  return {
    id: record.id,
    title: record.employeeName,
    subtitle: `Attendance - ${record.date}`,
    category: "attendance",
    url: "/dashboard/attendance",
    metadata: {
      employeeId: record.employeeId,
      employeeCode: record.employeeCode,
      department: record.department,
      status: record.status,
      workHours: record.workHours ?? 0,
      overtimeHours: record.overtimeHours ?? 0,
      location: record.location ?? "",
      shiftName: record.shiftName ?? "",
      clockInAt: record.clockInAt ?? "",
      clockOutAt: record.clockOutAt ?? ""
    }
  };
};

const normalizeLeave = (request: LeaveRequest): SearchResult => {
  return {
    id: request.id,
    title: request.employeeName,
    subtitle: `Leave Request - ${request.leaveType}`,
    category: "leave",
    url: "/dashboard/leave",
    metadata: {
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      status: request.status,
      reason: request.reason ?? ""
    }
  };
};

const normalizePayroll = (record: PayrollRecord): SearchResult => {
  return {
    id: record.id,
    title: record.employeeName,
    subtitle: `Payroll Statement - ${record.month} ${record.year}`,
    category: "payroll",
    url: "/dashboard/payroll",
    metadata: {
      employeeId: record.employeeId,
      employeeCode: record.employeeCode,
      department: record.department,
      designation: record.designation,
      month: record.month,
      year: record.year,
      status: record.status,
      basicSalary: record.salaryBreakdown.basicSalary,
      grossSalary: record.salaryBreakdown.grossSalary,
      taxableIncome: record.salaryBreakdown.taxableIncome,
      totalAllowances: record.salaryBreakdown.totalAllowances,
      totalDeductions: record.salaryBreakdown.totalDeductions,
      netSalary: record.salaryBreakdown.netSalary,
      generatedAt: record.generatedAt
    }
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
      employeeName: ticket.employeeName,
      department: ticket.department,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description
    }
  };
};

const employeeResults = mockEmployees.map(normalizeEmployee);
const departmentResults = mockDepartments.map(normalizeDepartment);
const attendanceResults = mockAttendanceRecords.map(normalizeAttendance);
const leaveResults = mockLeaveRequests.map(normalizeLeave);
const payrollResults = mockPayrollRecords.map(normalizePayroll);
const supportResults = mockSupportTickets.map(normalizeTicket);

export const searchDataset: SearchResult[] = [
  ...employeeResults,
  ...departmentResults,
  ...attendanceResults,
  ...leaveResults,
  ...payrollResults,
  ...supportResults
];