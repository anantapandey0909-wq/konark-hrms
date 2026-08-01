import React from 'react';
import { ManagerDashboard } from '@/components/manager-portal/manager-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manager Dashboard — Konark HRMS',
  description: 'Enterprise Manager Portal workspace to manage direct reports, approve requests, and monitor KPIs.',
};

export default function ManagerPortalPage() {
  return (
    <div className="py-4 max-w-7xl mx-auto px-4 md:px-6">
      <ManagerDashboard />
    </div>
  );
}