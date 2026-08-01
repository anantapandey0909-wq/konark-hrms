import { Metadata } from 'next';
import ProfileDashboard from '@/components/profile/profile-dashboard';

export const metadata: Metadata = {
  title: 'My Profile | Konark HRMS',
  description: 'Manage personal details, security settings, notification parameters, and track active log sessions.',
};

export default function ProfilePage() {
  return <ProfileDashboard />;
}