import { 
  ManagerProfile, 
  TeamMember, 
  AttendanceSummary, 
  PerformanceSummary, 
  ApprovalRequest, 
  ManagerAnnouncement, 
  UpcomingEvent 
} from '@/types/manager-portal';

export const mockManagerProfile: ManagerProfile = {
  id: "MGR-5082",
  name: "Marcus Sterling",
  designation: "Engineering Director",
  department: "Platform Engineering",
  avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
  teamSize: 15
};

export const mockTeamMembers: readonly TeamMember[] = [
  {
    id: "EMP-201",
    name: "Aria Montgomery",
    designation: "Principal Architect",
    department: "Platform Engineering",
    email: "aria.montgomery@konarkhrms.com",
    status: "Present",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:42 AM",
    hoursWorkedToday: 8.5,
    monthlyPerformanceScore: 96,
    isNewJoiner: false
  },
  {
    id: "EMP-202",
    name: "Devon Zhao",
    designation: "Senior Staff Engineer",
    department: "Platform Engineering",
    email: "devon.zhao@konarkhrms.com",
    status: "Remote",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:58 AM",
    hoursWorkedToday: 8.1,
    monthlyPerformanceScore: 92,
    isNewJoiner: false
  },
  {
    id: "EMP-203",
    name: "Sophia Martinez",
    designation: "DevOps Specialist",
    department: "Platform Engineering",
    email: "sophia.martinez@konarkhrms.com",
    status: "Present",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:35 AM",
    hoursWorkedToday: 8.2,
    monthlyPerformanceScore: 89,
    isNewJoiner: false
  },
  {
    id: "EMP-204",
    name: "Kenji Sato",
    designation: "Kubernetes Engineer",
    department: "Platform Engineering",
    email: "kenji.sato@konarkhrms.com",
    status: "Late",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    checkInTime: "09:42 AM",
    hoursWorkedToday: 7.3,
    monthlyPerformanceScore: 84,
    isNewJoiner: false
  },
  {
    id: "EMP-205",
    name: "Nesta Cooper",
    designation: "Database Administrator",
    department: "Platform Engineering",
    email: "nesta.cooper@konarkhrms.com",
    status: "On Leave",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
    monthlyPerformanceScore: 87,
    isNewJoiner: false
  },
  {
    id: "EMP-206",
    name: "Isabella Varga",
    designation: "Infrastructure Security Engineer",
    department: "Platform Engineering",
    email: "isabella.varga@konarkhrms.com",
    status: "Present",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:50 AM",
    hoursWorkedToday: 8.0,
    monthlyPerformanceScore: 91,
    isNewJoiner: false
  },
  {
    id: "EMP-207",
    name: "Tyler Jenkins",
    designation: "Junior Systems Admin",
    department: "Platform Engineering",
    email: "tyler.jenkins@konarkhrms.com",
    status: "Remote",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120",
    checkInTime: "09:00 AM",
    hoursWorkedToday: 8.0,
    monthlyPerformanceScore: 78,
    isNewJoiner: true
  },
  {
    id: "EMP-208",
    name: "Alba Petrova",
    designation: "SRE Consultant",
    department: "Platform Engineering",
    email: "alba.petrova@konarkhrms.com",
    status: "Present",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:15 AM",
    hoursWorkedToday: 9.0,
    monthlyPerformanceScore: 95,
    isNewJoiner: false
  },
  {
    id: "EMP-209",
    name: "Viktor Petrov",
    designation: "Linux Kernel Specialist",
    department: "Platform Engineering",
    email: "viktor.petrov@konarkhrms.com",
    status: "Absent",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    monthlyPerformanceScore: 82,
    isNewJoiner: false
  },
  {
    id: "EMP-210",
    name: "Chloe Dupont",
    designation: "Cloud Network Engineer",
    department: "Platform Engineering",
    email: "chloe.dupont@konarkhrms.com",
    status: "Remote",
    avatarUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:45 AM",
    hoursWorkedToday: 8.3,
    monthlyPerformanceScore: 88,
    isNewJoiner: false
  },
  {
    id: "EMP-211",
    name: "Rajesh Patel",
    designation: "Site Reliability Engineer",
    department: "Platform Engineering",
    email: "rajesh.patel@konarkhrms.com",
    status: "Present",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:52 AM",
    hoursWorkedToday: 8.0,
    monthlyPerformanceScore: 86,
    isNewJoiner: false
  },
  {
    id: "EMP-212",
    name: "Zoe Kaufmann",
    designation: "Platform Product Manager",
    department: "Platform Engineering",
    email: "zoe.kaufmann@konarkhrms.com",
    status: "Present",
    avatarUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:55 AM",
    hoursWorkedToday: 8.4,
    monthlyPerformanceScore: 93,
    isNewJoiner: false
  },
  {
    id: "EMP-213",
    name: "Emilio Cortez",
    designation: "Infrastructure Intern",
    department: "Platform Engineering",
    email: "emilio.cortez@konarkhrms.com",
    status: "Late",
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=120",
    checkInTime: "09:30 AM",
    hoursWorkedToday: 7.5,
    monthlyPerformanceScore: 76,
    isNewJoiner: true
  },
  {
    id: "EMP-214",
    name: "Sarah Jenkins",
    designation: "Release Engineer",
    department: "Platform Engineering",
    email: "sarah.jenkins@konarkhrms.com",
    status: "Remote",
    avatarUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=120",
    checkInTime: "09:05 AM",
    hoursWorkedToday: 8.0,
    monthlyPerformanceScore: 84,
    isNewJoiner: false
  },
  {
    id: "EMP-215",
    name: "Alexei Volkov",
    designation: "Senior Staff DevOps",
    department: "Platform Engineering",
    email: "alexei.volkov@konarkhrms.com",
    status: "Present",
    avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=120",
    checkInTime: "08:30 AM",
    hoursWorkedToday: 9.2,
    monthlyPerformanceScore: 94,
    isNewJoiner: false
  }
];

export const mockAttendanceSummary: AttendanceSummary = {
  attendancePercentage: 94.6,
  averageHoursPerDay: 8.2,
  lateRatePercentage: 13.3,
  trendData: [
    { date: "May 15", presentRate: 93, lateRate: 13 },
    { date: "May 16", presentRate: 95, lateRate: 6 },
    { date: "May 17", presentRate: 96, lateRate: 10 },
    { date: "May 18", presentRate: 94, lateRate: 13 },
    { date: "May 19", presentRate: 98, lateRate: 6 },
    { date: "May 20", presentRate: 95, lateRate: 13 }
  ]
};

export const mockPerformanceSummary: PerformanceSummary = {
  goalCompletionRate: 88,
  overallKpiScore: 91.2,
  taskCompletionCount: 164,
  targetTasks: 185,
  monthlyPerformanceRate: 87.8,
  breakdown: [
    { label: "Deployment Velocity", score: 94 },
    { label: "Cloud Cost Optimization", score: 86 },
    { label: "System Availability %", score: 99 },
    { label: "Security Vulnerability Patches", score: 92 }
  ]
};

export const mockApprovalRequests: readonly ApprovalRequest[] = [
  {
    id: "REQ-901",
    employeeId: "EMP-205",
    employeeName: "Nesta Cooper",
    employeeAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
    department: "Platform Engineering",
    requestType: "Leave",
    submittedDate: "May 18, 2025",
    details: "Family emergency medical procedures. Requesting 3 consecutive personal leave days.",
    priority: "Urgent",
    status: "Pending",
    leaveDates: {
      startDate: "May 22, 2025",
      endDate: "May 24, 2025",
      totalDays: 3
    }
  },
  {
    id: "REQ-902",
    employeeId: "EMP-204",
    employeeName: "Kenji Sato",
    employeeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    department: "Platform Engineering",
    requestType: "Attendance Correction",
    submittedDate: "May 19, 2025",
    details: "Mishap with office NFC turnstile. Badge scan was missed at morning entry, actual entry was 08:45 AM.",
    priority: "Medium",
    status: "Pending",
    correctionDetails: {
      date: "May 19, 2025",
      actualTimeIn: "08:45 AM",
      actualTimeOut: "05:45 PM"
    }
  },
  {
    id: "REQ-903",
    employeeId: "EMP-213",
    employeeName: "Emilio Cortez",
    employeeAvatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=120",
    department: "Platform Engineering",
    requestType: "Overtime",
    submittedDate: "May 19, 2025",
    details: "Supervised global staging platform server migration alongside core DevOps engineer. Clocked 4 hours over standard shifts.",
    priority: "High",
    status: "Pending",
    overtimeHours: 4
  },
  {
    id: "REQ-904",
    employeeId: "EMP-214",
    employeeName: "Sarah Jenkins",
    employeeAvatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=120",
    department: "Platform Engineering",
    requestType: "Work From Home",
    submittedDate: "May 20, 2025",
    details: "Home technician arriving for heating system repair. Requesting remote accommodation today.",
    priority: "Low",
    status: "Pending"
  }
];

export const mockAnnouncements: readonly ManagerAnnouncement[] = [
  {
    id: "ANN-501",
    title: "AWS Cloud Infrastructure Transition Deadline",
    content: "All platform clusters must switch to regional secure endpoints before the end of the upcoming week. Review dashboard alerts.",
    date: "May 20, 2025",
    category: "Policy Update",
    isImportant: true
  },
  {
    id: "ANN-502",
    title: "Upcoming Engineering Hackathon",
    content: "Registration is open for the upcoming annual HR hackathon. Exciting technical hardware and travel packages await winners.",
    date: "May 18, 2025",
    category: "Company News",
    isImportant: false
  },
  {
    id: "ANN-503",
    title: "Critical Security Patch Notice",
    content: "All direct reports must inspect their host systems for potential container runtime vulnerability. Run automated verify scripts.",
    date: "May 15, 2025",
    category: "HR Notification",
    isImportant: true
  }
];

export const mockUpcomingEvents: readonly UpcomingEvent[] = [
  {
    id: "EV-301",
    title: "Devon Zhao — Birthday",
    date: "May 21",
    type: "Birthday",
    description: "Prepare and transmit digital gift cards."
  },
  {
    id: "EV-302",
    title: "Quarterly Platform Review Board",
    date: "May 23",
    type: "Meeting",
    description: "Align core OKRs with corporate technology leaders."
  },
  {
    id: "EV-303",
    title: "Nesta Cooper — 3-Year Anniversary",
    date: "May 25",
    type: "Anniversary",
    description: "Team recognition slot at the daily sync meeting."
  },
  {
    id: "EV-304",
    title: "Advanced Kubernetes Optimization Workshop",
    date: "May 28",
    type: "Training",
    description: "Mandatory interactive deep-dive for cloud admins."
  },
  {
    id: "EV-305",
    title: "National Memorial Holiday",
    date: "May 26",
    type: "Holiday",
    description: "Offices completely offline. Operations will be run by automated paging shifts."
  }
];