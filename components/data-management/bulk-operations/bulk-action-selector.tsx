'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserCheck,
  UserMinus,
  ArrowRightLeft,
  UserCog,
  ShieldCheck,
  CalendarCheck,
  CalendarX,
  Coins,
  Clock,
} from 'lucide-react';
import {
  BULK_EMPLOYEE_ACTIONS,
  type BulkEmployeeAction,
} from '@/types/bulk-operation';

interface ActionOption {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  supported: boolean;
}

const actions: ActionOption[] = [
  { id: 'activate', title: 'Activate Employees', desc: 'Reinstate disabled staff lines.', icon: UserCheck, supported: true },
  { id: 'deactivate', title: 'Deactivate Employees', desc: 'Suspend offboarded accounts.', icon: UserMinus, supported: true },
  { id: 'transfer-dept', title: 'Transfer Department', desc: 'Cascade shift structural units.', icon: ArrowRightLeft, supported: true },
  { id: 'assign-manager', title: 'Assign Manager', desc: 'Direct reporting supervisors lines.', icon: UserCog, supported: true },
  { id: 'update-designation', title: 'Update Designation', desc: 'Assign core grade hierarchies.', icon: ShieldCheck, supported: false },
  { id: 'approve-leave', title: 'Approve Leave', desc: 'Acknowledge absence requests.', icon: CalendarCheck, supported: false },
  { id: 'reject-leave', title: 'Reject Leave', desc: 'Decline overlapping leave records.', icon: CalendarX, supported: false },
  { id: 'generate-payroll', title: 'Generate Payroll', desc: 'Initiate batch payout processes.', icon: Coins, supported: false },
  { id: 'assign-shift', title: 'Assign Shift', desc: 'Link schedules per division.', icon: Clock, supported: false },
];

interface BulkActionSelectorProps {
  selectedActionId: string;
  onSelectAction: (id: BulkEmployeeAction) => void;
}

export default function BulkActionSelector({
  selectedActionId,
  onSelectAction,
}: BulkActionSelectorProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div>
          <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
            Operation Parameters Action Selector
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Select a supported corporate action. Unsupported actions remain Coming soon.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((act) => {
            const Icon = act.icon;
            const isSelected = selectedActionId === act.id && act.supported;
            const isSupported = act.supported;

            return (
              <button
                type="button"
                key={act.id}
                disabled={!isSupported}
                aria-disabled={!isSupported}
                aria-pressed={isSelected}
                onClick={() => {
                  if (
                    isSupported &&
                    (BULK_EMPLOYEE_ACTIONS as readonly string[]).includes(act.id)
                  ) {
                    onSelectAction(act.id as BulkEmployeeAction);
                  }
                }}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all text-left ${
                  !isSupported
                    ? 'border-zinc-200 dark:border-zinc-850 bg-zinc-50/40 dark:bg-zinc-900/10 opacity-60 cursor-not-allowed'
                    : isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10 dark:ring-indigo-500/10 bg-indigo-50/5 dark:bg-zinc-900/40 cursor-pointer'
                      : 'border-zinc-200 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-900/20 hover:border-zinc-300 dark:hover:border-zinc-800 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-lg border ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-150 dark:border-indigo-900'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[8.5px] font-extrabold uppercase py-0.5 px-1.5 border ${
                      isSupported
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40'
                    }`}
                  >
                    {isSupported ? 'Ready' : 'Coming soon'}
                  </Badge>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                    {act.title}
                  </h4>
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                    {act.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
