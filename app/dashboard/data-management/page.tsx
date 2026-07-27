import { Metadata } from 'next';
import DataManagementDashboard from '@/components/data-management/dashboard/data-management-dashboard';
import { Database, FileUp, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Management | Konark HRMS',
  description: 'Enterprise centralized management system for data pipelines, batch operations, imports, exports, and integrity auditing.',
};

export default function DataManagementPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-100 dark:border-zinc-850 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Database className="h-3.5 w-3.5" />
            <span>Platform Services</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Data Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Centralized import, export and bulk data management for the organization.
          </p>
        </div>

        {/* Status indicator pill */}
        <div className="flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20 px-3.5 py-1.5 text-xs text-emerald-800 dark:text-emerald-400 self-start md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium">Data Sync System: Operational</span>
        </div>
      </div>

      {/* Safety Alert Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              Important Compliance Reminder
            </h4>
            <p className="text-xs text-amber-700/95 dark:text-amber-500/90 mt-1 leading-relaxed">
              Before running any batch modifications or importing fresh payroll modules, guarantee that your source files conform perfectly to our organization standards. Action errors will require manual data rollbacks.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Workspace */}
      <DataManagementDashboard />
    </div>
  );
}