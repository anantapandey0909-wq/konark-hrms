"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ShieldAlert, FileCheck } from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: "VERIFIED" | "PENDING_REVIEW" | "REJECTED";
  uploadedAt: string;
}

interface DocumentsSummaryProps {
  readonly documents: readonly DocumentItem[];
}

export function DocumentsSummary({ documents }: DocumentsSummaryProps) {
  const getBadgeStyles = (status: DocumentItem["status"]) => {
    switch (status) {
      case "VERIFIED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
      case "PENDING_REVIEW":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          KYC Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {documents.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No documents uploaded.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="rounded bg-slate-50 p-2 dark:bg-slate-900/40 mt-0.5">
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                    {doc.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {doc.type} &bull; {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <Badge variant="outline" className={`${getBadgeStyles(doc.status)} text-[9px] uppercase tracking-wider`}>
                  {doc.status === "VERIFIED" ? (
                    <span className="flex items-center gap-1">
                      <FileCheck className="h-3 w-3" />
                      OK
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}