import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PerformanceSummary } from '@/components/manager-portal/performance-summary';
import { mockPerformanceSummary, mockTeamMembers } from '@/mock/manager-portal';
import { Award, ArrowLeft, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Performance Management — Konark HRMS',
  description: 'Examine objectives, performance analytics and task completion data.',
};

export default function PerformanceDashboardPage() {
  // Sort high scorers
  const topPerformers = [...mockTeamMembers]
    .sort((a, b) => b.monthlyPerformanceScore - a.monthlyPerformanceScore)
    .slice(0, 3);

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-2">
        
          <Button asChild>
  <Link href="...">
    ...
  </Link>
</Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="h-7 w-7 text-indigo-500" />
            <span>Productivity & Goal Performance</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Audit team reliability margins, technical KPIs, and key team milestones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceSummary summary={mockPerformanceSummary} />
        </div>

        <div className="space-y-6">
          {/* Top Performers */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Target className="h-4 w-4 text-emerald-500" />
                <span>Top KPI Accomplishments</span>
              </CardTitle>
              <CardDescription className="text-xs">Highest registered performance scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPerformers.map((p, i) => (
                <div key={p.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{p.designation}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{p.monthlyPerformanceScore}%</span>
                    <p className="text-[9px] text-muted-foreground">Rank #{i+1}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evaluation Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              <p>
                Metrics are gathered weekly across git platforms, system uptime databases, and code coverage checks.
              </p>
              <p>
                Scores above 90% qualify for quarterly excellence bonuses. High performing staff are prioritized for leadership training.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}