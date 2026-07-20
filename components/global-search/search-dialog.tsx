"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { SearchResult } from "@/types/search";
import { SearchInput } from "./search-input";
import { SearchResults } from "./search-results";
import { SearchEmpty } from "./search-empty";

export interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  onSelect: (item: SearchResult) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
  results,
  onSelect,
}: SearchDialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange]);

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length > 0 && results.length > 0;
  const showEmptyState = trimmedQuery.length > 0 && results.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl overflow-hidden p-0 shadow-lg"
        aria-label="Global Search"
      >
        <SearchInput
          value={query}
          onValueChange={onQueryChange}
          autoFocus
        />

        {showResults ? (
          <SearchResults
            results={results}
            onSelect={onSelect}
          />
        ) : showEmptyState ? (
          <SearchEmpty />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}