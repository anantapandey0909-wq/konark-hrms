"use client";

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TeamMember } from '@/types/manager-portal';
import { Search, Mail, Filter, ShieldCheck, Video, CircleDot, AlertTriangle } from 'lucide-react';

interface TeamMembersTableProps {
  readonly team: readonly TeamMember[];
}

export function TeamMembersTable({ team }: TeamMembersTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = team.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.designation.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400 border-none flex items-center gap-1 w-fit"><ShieldCheck className="h-3 w-3" /> Office</Badge>;
      case 'Remote':
        return <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/15 dark:text-blue-400 border-none flex items-center gap-1 w-fit"><Video className="h-3 w-3" /> Remote</Badge>;
      case 'Late':
        return <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400 border-none flex items-center gap-1 w-fit"><AlertTriangle className="h-3 w-3" /> Late</Badge>;
      case 'On Leave':
        return <Badge className="bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-400 border-none flex items-center gap-1 w-fit"><CircleDot className="h-3 w-3" /> On Leave</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none flex items-center gap-1 w-fit">Absent</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9.5 text-xs font-semibold"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["All", "Present", "Remote", "Late", "On Leave", "Absent"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className="text-[11px] font-bold h-8 px-3.5"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/40">
              <TableRow>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider">Employee</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider">Workplace</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider">Shift Start</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider">Monthly Score</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider">KPI Rating</TableHead>
                <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-semibold">
                    No team members match this search parameters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={m.avatarUrl} alt={m.name} />
                          <AvatarFallback className="text-[10px] font-bold">
                            {m.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{m.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {getStatusBadge(m.status)}
                    </TableCell>
                    <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      {m.checkInTime ?? "—"}
                    </TableCell>
                    <TableCell className="py-3 text-xs font-black text-slate-800 dark:text-slate-100">
                      {m.monthlyPerformanceScore}%
                    </TableCell>
                    <TableCell className="py-3 w-[150px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                          <span>Progress</span>
                          <span>{m.monthlyPerformanceScore}%</span>
                        </div>
                        <Progress value={m.monthlyPerformanceScore} className="h-1 bg-slate-100 dark:bg-slate-800" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 text-muted-foreground hover:text-slate-800 transition-colors">
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}