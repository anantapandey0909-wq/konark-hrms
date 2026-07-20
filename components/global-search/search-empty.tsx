"use client";

import * as React from "react";
import { SearchX } from "lucide-react";

export function SearchEmpty() {
  return (
    <section 
      className="flex flex-col items-center justify-center px-6 py-14 text-center"
      aria-labelledby="search-empty-title"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 id="search-empty-title" className="mt-4 text-sm font-semibold text-foreground">
        No results found
      </h3>
      <p className="mt-2 max-w-sm text-xs text-muted-foreground leading-relaxed">
        Try searching by employee name, employee ID, department, payroll, attendance or support ticket.
      </p>
    </section>
  );
}