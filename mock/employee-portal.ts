import { 
  EmployeeProfile, 
  AttendanceSummary, 
  LeaveBalance, 
  Holiday, 
  Announcement, 
  NotificationItem 
} from "@/types/employee-portal";

export const mockEmployeeProfile: EmployeeProfile = {
  id: "emp-9402",
  employeeCode: "KON-9402",
  name: "Arjun Sharma",
  email: "arjun.sharma@konark.io",
  designation: "Senior Software Engineer",
  department: "Product Engineering",
  joinDate: "2022-04-12",
  managerName: "Neha Gupta",
  avatarUrl: undefined, // Will fallback to initials avatar
};

export const mockAttendanceSummary: AttendanceSummary = {
  clockedIn: false,
  weeklyCompliancePercentage: 92.5,
  monthlyAttendanceRate: 98.2,
};

export const mockLeaveBalances: LeaveBalance[] = [
  { type: "CASUAL", label: "Casual Leave", allocated: 12, used: 4, pending: 1 },
  { type: "SICK", label: "Sick Leave", allocated: 10, used: 2, pending: 0 },
  { type: "ANNUAL", label: "Annual Leave", allocated: 18, used: 8, pending: 2 },
  { type: "COMPENSATORY", label: "Compensatory Off", allocated: 5, used: 3, pending: 0 },
];

export const mockHolidays: Holiday[] = [
  { id: "h-1", name: "Diwali", date: "2025-11-01", isOptional: false },
  { id: "h-2", name: "Guru Nanak Jayanti", date: "2025-11-05", isOptional: true },
  { id: "h-3", name: "Christmas Day", date: "2025-12-25", isOptional: false },
  { id: "h-4", name: "Republic Day", date: "2026-01-26", isOptional: false },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Annual Health Check-up Camp 2025",
    summary: "Register for our annual preventive health camp happening on-site next Friday.",
    content: "We are organizing our annual preventive health screening camp on Friday next week. All full-time employees are eligible for a free screening. Slots are limited. Please register through the shared portal before Wednesday.",
    category: "EVENT",
    publishedAt: "2025-10-24T10:00:00Z",
    author: "HR Operations",
  },
  {
    id: "ann-2",
    title: "Updated Remote Work Guidelines",
    summary: "Please review the updated policy framework regarding hybrid workspace utilization.",
    content: "The leadership team has formulated a comprehensive update to our workspace utilization. Please refer to the updated policy handbook in the shared workspace, effective from the first of next month.",
    category: "POLICY",
    publishedAt: "2025-10-22T08:30:00Z",
    author: "Compliance & HR",
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Leave Approved",
    description: "Your leave request for Casual Leave has been approved by Neha Gupta.",
    type: "SUCCESS",
    timestamp: "2025-10-25T14:20:00Z",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Timesheet Pending Submission",
    description: "Please submit your outstanding weekly timesheet before EOD.",
    type: "WARNING",
    timestamp: "2025-10-25T09:00:00Z",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Policy Declaration Signed",
    description: "Thank you for completing your yearly compliance declarations.",
    type: "INFO",
    timestamp: "2025-10-23T11:45:00Z",
    isRead: true,
  },
];