import { UserProfile } from '@/types/profile';

// Mock profile owns preferences, security configurations, and timelines exclusively.
// Identity details (names, roles, etc.) are injected from the single source of truth hook dynamically.
export const mockUserProfile: UserProfile = {
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: 'female',
  dateOfBirth: '1994-08-14',
  bloodGroup: 'O+',
  address: 'Suite 405, Prestige Cyber Heights, Tech Park Lane, Bangalore, KA - 560103',
  emergencyContact: {
    name: 'Ramesh Sharma',
    relationship: 'Father',
    phone: '+91 98765 00112'
  },
  joiningDate: '2021-06-15',
  reportingManager: 'Arvind Swamy (Director of Design)',
  username: 'harshita.sharma',
  role: '',
  department: '',
  designation: '',
  company: '',
  employmentType: 'full_time',
  accountStatus: 'active',
  createdDate: '',
  lastLogin: '',
  preferences: {
    theme: 'system',
    language: 'en-US',
    timeZone: 'Asia/Kolkata (GMT+5:30)',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12h',
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyDigest: true
    }
  },
  security: {
    passwordLastChanged: '2024-11-20T14:32:00Z',
    twoFactorEnabled: true,
    activeSessionsCount: 3
  },
  activities: [
    {
      id: 'ACT-01',
      title: 'Profile Metadata Modified',
      description: 'Updated emergency contact number configuration.',
      timestamp: '2025-02-14T09:30:00Z',
      type: 'profile_change'
    },
    {
      id: 'ACT-02',
      title: 'Security Settings Configured',
      description: 'Activated Two-Factor Authentication via Authenticator app.',
      timestamp: '2025-02-10T11:20:00Z',
      type: 'security_update'
    },
    {
      id: 'ACT-03',
      title: 'Theme Preference Changed',
      description: 'Switched display theme configuration parameters to System default.',
      timestamp: '2025-02-05T15:00:00Z',
      type: 'preference_change'
    },
    {
      id: 'ACT-04',
      title: 'Password Successfully Changed',
      description: 'Dynamic user credential rotation executed.',
      timestamp: '2024-11-20T14:32:00Z',
      type: 'security_update'
    }
  ],
  loginHistory: [
    {
      id: 'LOG-01',
      device: 'Google Chrome (macOS Sequoia)',
      ipAddress: '157.45.92.110',
      location: 'Bangalore, India',
      timestamp: '2025-02-15T18:12:00Z',
      status: 'successful'
    },
    {
      id: 'LOG-02',
      device: 'Safari Mobile (iPhone 15 Pro)',
      ipAddress: '103.88.22.14',
      location: 'Bangalore, India',
      timestamp: '2025-02-15T14:30:00Z',
      status: 'successful'
    },
    {
      id: 'LOG-03',
      device: 'Opera Browser (macOS)',
      ipAddress: '157.45.92.110',
      location: 'Bangalore, India',
      timestamp: '2025-02-14T08:15:00Z',
      status: 'failed'
    }
  ]
};