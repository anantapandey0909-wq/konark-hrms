"use client";

import * as React from "react";
import { User, Building2, Clock, CalendarDays, CreditCard, LifeBuoy, Compass } from "lucide-react";
import type { SearchResult, SearchCategory } from "@/types/search";
import { cn } from "@/lib/utils";

interface SearchResultItemProps {
  item: SearchResult;
  onSelect?: (item: SearchResult) => void;
}

const CATEGORY_ICONS: Record<SearchCategory, React.ComponentType<{ className?: string }>> = {
  employees: User,
  departments: Building2,
  attendance: Clock,
  leave: CalendarDays,
  payroll: CreditCard,
  support: LifeBuoy,
  navigation: Compass
};

export const SearchResultItem = React.memo(({ item, onSelect }: SearchResultItemProps) => {
  const Icon = CATEGORY_ICONS[item.category];

  const handleClick = React.useCallback(() => {
    onSelect?.(item);
  }, [item, onSelect]);

  const ariaLabel = item.subtitle ? `${item.title} - ${item.subtitle}` : item.title;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={ariaLabel}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <p className="font-medium text-foreground truncate">{item.title}</p>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
        )}
      </div>
    </button>
  );
});

SearchResultItem.displayName = "SearchResultItem";