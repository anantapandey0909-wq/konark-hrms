"use client";

import * as React from "react";
import type { SearchResult } from "@/types/search";
import { groupSearchResults } from "@/lib/search-utils";
import { SearchResultItem } from "./search-result-item";

interface SearchResultsProps {
  results: SearchResult[];
  onSelect?: (item: SearchResult) => void;
}

const CATEGORY_LABELS = {
    navigation:"Navigation",
  employees: "Employees",
  departments: "Departments",
  attendance: "Attendance",
  leave: "Leave",
  payroll: "Payroll",
  support: "Support"
};

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  const groupedResults = React.useMemo(() => {
    return groupSearchResults(results);
  }, [results]);

  if (results.length === 0 || groupedResults.length === 0) {
    return null;
  }

  return (
    <div 
      className="max-h-[400px] overflow-y-auto p-2"
      role="region"
      aria-label="Search Results"
    >
      {groupedResults.map((group) => {
        if (group.items.length === 0) {
          return null;
        }

        return (
          <div key={group.category} className="mb-4 last:mb-0">
            <h3 className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {CATEGORY_LABELS[group.category]}
            </h3>
            <ul role="list" className="mt-1 space-y-1">
              {group.items.map((item) => (
                <li key={item.id} role="listitem">
                  <SearchResultItem 
                    item={item} 
                    onSelect={onSelect}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}