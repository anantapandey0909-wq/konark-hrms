export interface EmployeeMetrics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  suspendedEmployees: number;
  onLeaveEmployees: number;
}

export interface AttendanceMetrics {
  presentCount: number;
  absentCount: number;
  lateCount: number;
  onLeaveCount: number;
  attendanceRate: number;
  averageWorkHours: number;
  totalOvertimeHours: number;
}

export interface LeaveMetrics {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  cancelledRequests: number;
}

export interface PayrollMetrics {
  employeeCount: number;
  totalPayrollRecords: number;
  paidPayroll: number;
  pendingPayroll: number;
  approvedPayroll: number;
  draftPayroll: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  averageNetSalary: number;
}