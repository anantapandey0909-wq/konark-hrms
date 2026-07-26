"use client";

import * as React from "react";
import { ResolvedDepartment } from "@/types/department";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, Info, DollarSign } from "lucide-react";

interface DepartmentBudgetProps {
  readonly department: ResolvedDepartment;
}

export function DepartmentBudget({ department }: DepartmentBudgetProps) {
  const totalBudget = department.budget || 0;
  const committedSpend = Math.round(totalBudget * 0.65);
  const percentageSpent = totalBudget > 0 ? (committedSpend / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Annual fiscal pool allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Committed Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">${committedSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Headcount and active operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Funds</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ${(totalBudget - committedSpend).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Uncommitted financial balance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
          <CardDescription>Visualizing fiscal consumption thresholds against department limitations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>{Math.round(percentageSpent)}% Utilized</span>
              <span className="text-muted-foreground">
                ${committedSpend.toLocaleString()} / ${totalBudget.toLocaleString()}
              </span>
            </div>
            <Progress value={percentageSpent} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}