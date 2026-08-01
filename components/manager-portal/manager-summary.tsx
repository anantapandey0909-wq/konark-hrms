"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { ManagerDashboardStats } from '@/types/manager-portal';

interface ManagerSummaryProps {
  readonly stats: ManagerDashboardStats;
}

export function ManagerSummary({ stats }: ManagerSummaryProps) {
  const cards = [
    {
      title: "Team Members",
      value: stats.totalTeamCount,
      sub: `${stats.newJoinersCount} New this month`,
      icon: Users,
      color: "text-blue-500 bg-blue-500/10 border-blue-200/20"
    },
    {
      title: "Present Today",
      value: stats.presentCount + stats.remoteCount + stats.lateCount,
      sub: `${stats.remoteCount} Remote • ${stats.lateCount} Late`,
      icon: CheckCircle,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-200/20"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovalsCount,
      sub: "Requires authorization",
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10 border-amber-200/20",
      highlight: stats.pendingApprovalsCount > 0
    },
    {
      title: "Productivity",
      value: `${stats.monthlyProductivityRate}%`,
      sub: "Average KPI accuracy",
      icon: Sparkles,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-200/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`overflow-hidden border bg-card transition-all hover:shadow-md ${card.highlight ? 'ring-2 ring-amber-500/30 border-amber-500/50' : 'border-slate-100 dark:border-slate-800'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</p>
                  <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                  <p className="text-[11px] text-muted-foreground">{card.sub}</p>
                </div>
                <div className={`p-3 rounded-xl border ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}