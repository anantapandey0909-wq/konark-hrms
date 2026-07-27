'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';

interface TemplateCardProps {
  title: string;
  desc: string;
  format: string;
  version: string;
  lastUpdated: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function TemplateCard({
  title,
  desc,
  format,
  version,
  lastUpdated,
  icon: Icon
}: TemplateCardProps) {
  return (
    <Card className="h-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transition-all flex flex-col justify-between p-4 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <Badge variant="outline" className="text-[9px] font-mono font-extrabold tracking-wide uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none px-1.5 py-0.5">
            {format}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h4>
          <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
            {desc}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
          <span>Ver: {version}</span>
          <span>Updated: {lastUpdated}</span>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          disabled 
          className="w-full text-xs h-8 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 border-zinc-200 dark:border-zinc-750 inline-flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-900"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download</span>
        </Button>
      </div>
    </Card>
  );
}