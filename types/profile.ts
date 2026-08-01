export type AccountStatus = 'active' | 'suspended' | 'on_leave';

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  weeklyDigest: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: NotificationSettings;
}

export interface SecuritySettings {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
}

export interface LoginHistory {
  id: string;
  device: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  status: 'successful' | 'failed';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'profile_change' | 'security_update' | 'preference_change' | 'login';
}

export interface UserProfile {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | 'undisclosed';
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  joiningDate: string;
  reportingManager: string;
  username: string;
  role: string;
  department: string;
  designation: string;
  company: string;
  employmentType: EmploymentType;
  accountStatus: AccountStatus;
  createdDate: string;
  lastLogin: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  security: SecuritySettings;
  activities: ActivityItem[];
  loginHistory: LoginHistory[];
}