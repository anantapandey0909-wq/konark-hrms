"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onValueChange,
      autoFocus,
      placeholder = "Search employees, payroll, departments...",
      className
    },
    ref
  ) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(e.target.value);
      },
      [onValueChange]
    );

    return (
      <div className={cn("relative flex items-center border-b px-4 bg-background", className)}>
        <Search className="h-4 w-4 shrink-0 text-muted-foreground opacity-60" aria-hidden="true" />
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search"
          className="flex h-12 w-full rounded-none border-0 bg-transparent py-3 pl-3 pr-0 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";