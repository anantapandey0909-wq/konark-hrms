import { 
  TeamMember, 
  ApprovalRequest, 
  UpcomingEvent,
  ManagerDashboardStats
} from '@/types/manager-portal';

export function getGreetingByTime(date: Date = new Date()): string {
  const hours = date.getHours();
  if (hours < 12) {
    return 'Good morning';
  } else if (hours < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

export function formatEmployeeName(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) return name;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function calculateAttendancePercentage(team: readonly TeamMember[]): number {
  if (team.length === 0) return 0;
  const eligiblePresent = team.filter(m => m.status === 'Present' || m.status === 'Remote' || m.status === 'Late').length;
  return Math.round((eligiblePresent / team.length) * 100);
}

export function calculateAverageHours(team: readonly TeamMember[]): number {
  const activeMembers = team.filter(m => m.hoursWorkedToday !== undefined && m.hoursWorkedToday > 0);
  if (activeMembers.length === 0) return 0;
  const totalHours = activeMembers.reduce((sum, curr) => sum + (curr.hoursWorkedToday || 0), 0);
  return parseFloat((totalHours / activeMembers.length).toFixed(1));
}

export function calculatePerformance(team: readonly TeamMember[]): number {
  if (team.length === 0) return 0;
  const totalScore = team.reduce((sum, curr) => sum + curr.monthlyPerformanceScore, 0);
  return Math.round(totalScore / team.length);
}

export function countPendingApprovals(requests: readonly ApprovalRequest[]): number {
  return requests.filter(r => r.status === 'Pending').length;
}

export function filterPendingRequests(
  requests: readonly ApprovalRequest[], 
  type?: ApprovalRequest['requestType']
): readonly ApprovalRequest[] {
  const pending = requests.filter(r => r.status === 'Pending');
  if (!type) return pending;
  return pending.filter(r => r.requestType === type);
}

export function groupApprovals(
  requests: readonly ApprovalRequest[]
): Record<ApprovalRequest['requestType'], readonly ApprovalRequest[]> {
  const initial: Record<ApprovalRequest['requestType'], ApprovalRequest[]> = {
    'Leave': [],
    'Attendance Correction': [],
    'Overtime': [],
    'Work From Home': []
  };

  return requests.reduce((acc, curr) => {
    acc[curr.requestType].push(curr);
    return acc;
  }, initial);
}

export function sortUpcomingEvents(events: readonly UpcomingEvent[]): readonly UpcomingEvent[] {
  return [...events].sort((a, b) => {
    const parseDate = (dStr: string) => {
      const currentYear = new Date().getFullYear();
      if (dStr.toLowerCase().includes('today')) return new Date(new Date().setHours(0, 0, 0, 0)).getTime();
      if (dStr.toLowerCase().includes('tomorrow')) return new Date(new Date().setDate(new Date().getDate() + 1)).getTime();
      
      const parsed = Date.parse(`${dStr}, ${currentYear}`);
      return isNaN(parsed) ? 9999999999999 : parsed;
    };
    return parseDate(a.date) - parseDate(b.date);
  });
}

export function generateDashboardStats(
  team: readonly TeamMember[], 
  approvals: readonly ApprovalRequest[]
): ManagerDashboardStats {
  const totalTeamCount = team.length;
  const presentCount = team.filter(m => m.status === 'Present').length;
  const remoteCount = team.filter(m => m.status === 'Remote').length;
  const lateCount = team.filter(m => m.status === 'Late').length;
  const absentCount = team.filter(m => m.status === 'Absent').length;
  const onLeaveCount = team.filter(m => m.status === 'On Leave').length;
  const newJoinersCount = team.filter(m => m.isNewJoiner).length;
  
  const pendingApprovalsCount = countPendingApprovals(approvals);
  
  // Average performance is mapped to monthly productivity rate
  const monthlyProductivityRate = calculatePerformance(team);

  return {
    totalTeamCount,
    presentCount,
    remoteCount,
    lateCount,
    absentCount,
    onLeaveCount,
    newJoinersCount,
    pendingApprovalsCount,
    monthlyProductivityRate
  };
}