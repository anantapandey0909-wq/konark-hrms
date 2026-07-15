"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Layout & Structural Constants
const KPI_CARD_COUNT = 4;
const OVERVIEW_CARD_COUNT = 4;
const OVERVIEW_ROW_COUNT = 5;
const CHART_CARD_COUNT = 4;

// Reusable Internal Render Helpers for Reduced JSX Duplication
function LoadingCardHeader() {
  return (
    <CardHeader className="space-y-2 pb-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
    </CardHeader>
  );
}

function LoadingMetricRow() {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2.5 last:border-0">
      <div className="flex items-center gap-2">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

export function ReportsLoading() {
  return (
    <div className="space-y-6">
      {/* 1. Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* 2. Filters Toolbar Skeleton */}
      <div className="mt-6 flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-48" /> {/* Date Range Selector */}
          <Skeleton className="h-10 w-36" /> {/* Department Dropdown */}
          <Skeleton className="h-10 w-36" /> {/* Employment Status Dropdown */}
        </div>
        <Skeleton className="h-10 w-28 self-end sm:self-auto" /> {/* Export Trigger Button */}
      </div>

      {/* 3. KPI Summary Cards Skeleton */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: KPI_CARD_COUNT }).map((_, cardIndex) => (
          <Card key={`kpi-skeleton-${cardIndex}`} className="shadow-xs">
            <CardHeader className="space-y-2 pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. Reports Overview Skeleton */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: OVERVIEW_CARD_COUNT }).map((_, cardIndex) => (
          <Card key={`overview-skeleton-${cardIndex}`} className="shadow-xs">
            <LoadingCardHeader />
            <CardContent className="space-y-1">
              {Array.from({ length: OVERVIEW_ROW_COUNT }).map((_, rowIndex) => (
                <LoadingMetricRow key={`row-skeleton-${cardIndex}-${rowIndex}`} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 5. Chart Section Skeleton */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: CHART_CARD_COUNT }).map((_, cardIndex) => (
          <Card key={`chart-skeleton-${cardIndex}`} className="shadow-xs">
            <LoadingCardHeader />
            <CardContent>
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}