export type ApprovalPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type ApprovalType = 'Leave' | 'Attendance Correction' | 'Overtime' | 'Work From Home';

export interface ManagerProfile {
  readonly id: string;
  readonly name: string;
  readonly designation: string;
  readonly department: string;
  readonly avatarUrl?: string;
  readonly teamSize: number;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly designation: string;
  readonly department: string;
  readonly email: string;
  readonly status: 'Present' | 'Absent' | 'Remote' | 'Late' | 'On Leave';
  readonly avatarUrl?: string;
  readonly checkInTime?: string;
  readonly hoursWorkedToday?: number;
  readonly monthlyPerformanceScore: number;
  readonly isNewJoiner: boolean;
}

export interface AttendanceTrend {
  readonly date: string;
  readonly presentRate: number;
  readonly lateRate: number;
}

export interface AttendanceSummary {
  readonly attendancePercentage: number;
  readonly averageHoursPerDay: number;
  readonly lateRatePercentage: number;
  readonly trendData: readonly AttendanceTrend[];
}

export interface PerformanceMetric {
  readonly label: string;
  readonly score: number;
}

export interface PerformanceSummary {
  readonly goalCompletionRate: number;
  readonly overallKpiScore: number;
  readonly taskCompletionCount: number;
  readonly targetTasks: number;
  readonly monthlyPerformanceRate: number;
  readonly breakdown: readonly PerformanceMetric[];
}

export interface ApprovalRequest {
  readonly id: string;
  readonly employeeId: string;
  readonly employeeName: string;
  readonly employeeAvatar?: string;
  readonly department: string;
  readonly requestType: ApprovalType;
  readonly submittedDate: string;
  readonly details: string;
  readonly priority: ApprovalPriority;
  readonly status: ApprovalStatus;
  readonly leaveDates?: {
    readonly startDate: string;
    readonly endDate: string;
    readonly totalDays: number;
  };
  readonly correctionDetails?: {
    readonly date: string;
    readonly actualTimeIn: string;
    readonly actualTimeOut: string;
  };
  readonly overtimeHours?: number;
}

export interface ManagerAnnouncement {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly date: string;
  readonly category: 'Company News' | 'Policy Update' | 'HR Notification';
  readonly isImportant: boolean;
}

export interface UpcomingEvent {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly type: 'Birthday' | 'Anniversary' | 'Meeting' | 'Training' | 'Holiday';
  readonly description: string;
}

export interface QuickAction {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly iconName: string;
  readonly badgeCount?: number;
}

export interface ManagerDashboardStats {
  readonly totalTeamCount: number;
  readonly presentCount: number;
  readonly remoteCount: number;
  readonly lateCount: number;
  readonly absentCount: number;
  readonly onLeaveCount: number;
  readonly newJoinersCount: number;
  readonly pendingApprovalsCount: number;
  readonly monthlyProductivityRate: number;
}

export interface ChartDataPoint {
  readonly label: string;
  readonly value: number;
  readonly secondaryValue?: number;
}