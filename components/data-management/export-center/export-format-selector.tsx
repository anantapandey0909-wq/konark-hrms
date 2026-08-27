'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode2, FileSpreadsheet, FileText, Code } from 'lucide-react';
import { useExportCenter } from './export-center-context';
import type { ExportFormat } from '@/lib/validation/export';

interface FormatOption {
  id: ExportFormat | 'pdf';
  title: string;
  ext: string;
  desc: string;
  useCase: string;
  status: 'Ready' | 'Maintenance';
  selectable: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const formats: FormatOption[] = [
  {
    id: 'xlsx',
    title: 'Microsoft Excel',
    ext: '.xls',
    desc: 'SpreadsheetML workbook opened by Excel (no third-party XLSX package).',
    useCase: 'Managerial and finance audits in Excel.',
    status: 'Ready',
    selectable: true,
    icon: FileSpreadsheet,
  },
  {
    id: 'csv',
    title: 'Comma Separated Values',
    ext: '.csv',
    desc: 'UTF-8 CSV with formula-injection protection.',
    useCase: 'Integrations and database loaders.',
    status: 'Ready',
    selectable: true,
    icon: FileText,
  },
  {
    id: 'pdf',
    title: 'Portable Document',
    ext: '.pdf',
    desc: 'PDF generation requires a dedicated library not present in this project.',
    useCase: 'Government filings — planned.',
    status: 'Maintenance',
    selectable: false,
    icon: FileCode2,
  },
  {
    id: 'json',
    // cast: JSON is implemented as ExportFormat
    title: 'JSON Stream',
    ext: '.json',
    desc: 'Structured JSON array of row objects.',
    useCase: 'Programmatic migrations and API handoff.',
    status: 'Ready',
    selectable: true,
    icon: Code,
  },
];

export default function ExportFormatSelector() {
  const { selectedFormat, setSelectedFormat } = useExportCenter();

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden select-none">
      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div>
          <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-150">
            Export Format Parameters
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Choose a format that is actually implemented. PDF remains unavailable until a PDF library is approved.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected =
              fmt.selectable && fmt.id === selectedFormat;
            return (
              <button
                key={fmt.id}
                type="button"
                disabled={!fmt.selectable}
                onClick={() => {
                  if (fmt.selectable) setSelectedFormat(fmt.id as ExportFormat);
                }}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10 dark:ring-indigo-500/10 bg-indigo-50/5 dark:bg-zinc-900/40'
                    : 'border-zinc-200 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-900/20'
                } ${!fmt.selectable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-300'}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-lg border ${\n                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-150 dark:border-indigo-900'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[8.5px] font-extrabold uppercase py-0.5 px-1.5 border ${\n                        fmt.status === 'Ready'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40'
                      }`}
                    >
                      {fmt.status}
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
                      {fmt.title}
                      <span className="text-[10px] text-zinc-400 font-mono">
                        ({fmt.ext})
                      </span>
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                      {fmt.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
                  <span className="font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider text-[9px] mb-0.5">
                    Integration context:
                  </span>
                  <p className="line-clamp-2">{fmt.useCase}</p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
