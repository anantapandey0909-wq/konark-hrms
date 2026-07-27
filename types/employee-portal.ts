export interface EmployeeProfile {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  joinDate: string;
  managerName: string;
  avatarUrl?: string;
}

export interface AttendanceSummary {
  clockedIn: boolean;
  todayFirstPunch?: string;
  todayLastPunch?: string;
  totalHoursToday?: string;
  weeklyCompliancePercentage: number;
  monthlyAttendanceRate: number;
}

export interface LeaveBalance {
  type: "CASUAL" | "SICK" | "ANNUAL" | "COMPENSATORY";
  label: string;
  allocated: number;
  used: number;
  pending: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  isOptional: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "POLICY" | "EVENT" | "ANNOUNCEMENT" | "SYSTEM";
  publishedAt: string;
  author: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  timestamp: string;
  isRead: boolean;
}