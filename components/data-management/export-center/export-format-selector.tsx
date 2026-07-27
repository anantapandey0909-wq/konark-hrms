'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode2, FileSpreadsheet, FileText, Code } from 'lucide-react';

interface FormatOption {
  id: string;
  title: string;
  ext: string;
  desc: string;
  useCase: string;
  status: 'Ready' | 'Maintenance';
  icon: React.ComponentType<{ className?: string }>;
}

const formats: FormatOption[] = [
  { id: 'excel', title: 'Microsoft Excel', ext: '.xlsx', desc: 'Standard business spreadsheet formula parameters.', useCase: 'Managerial and manual finance audits.', status: 'Ready', icon: FileSpreadsheet },
  { id: 'csv', title: 'Comma Separated Values', ext: '.csv', desc: 'Pure UTF-8 text file mapping values per line.', useCase: 'Data loading and integrations with database engines.', status: 'Ready', icon: FileText },
  { id: 'pdf', title: 'Portable Document', ext: '.pdf', desc: 'Formatted read-only documents with enterprise layout.', useCase: 'Government filings and payslip auditing.', status: 'Ready', icon: FileCode2 },
  { id: 'json', title: 'JSON Stream', ext: '.json', desc: 'Serialized structural mapping strings.', useCase: 'Direct programmatic REST migrations.', status: 'Maintenance', icon: Code }
];

export default function ExportFormatSelector() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div>
          <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
            Export Format Parameters
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Choose format extension matching target processing requirements.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {formats.map((fmt, idx) => {
            const Icon = fmt.icon;
            // Static visual select mimicking primary option (Excel)
            const isSelected = fmt.id === 'excel';
            return (
              <div
                key={fmt.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10 dark:ring-indigo-500/10 bg-indigo-50/5 dark:bg-zinc-900/40'
                    : 'border-zinc-200 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-900/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border ${
                      isSelected 
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-150 dark:border-indigo-900' 
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700'
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant="outline" className={`text-[8.5px] font-extrabold uppercase py-0.5 px-1.5 border ${
                      fmt.status === 'Ready' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' 
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40'
                    }`}>
                      {fmt.status}
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
                      {fmt.title}
                      <span className="text-[10px] text-zinc-400 font-mono">({fmt.ext})</span>
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                      {fmt.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
                  <span className="font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider text-[9px] mb-0.5">Integration context:</span>
                  <p className="line-clamp-2">{fmt.useCase}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}