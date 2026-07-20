"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchTrigger } from "./search-trigger";
import { SearchDialog } from "./search-dialog";
import { searchDataset } from "@/mock/search";
import { searchItems, sortSearchResults } from "@/lib/search-utils";
import type { SearchResult } from "@/types/search";

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
    }
  }, []);

  const results = React.useMemo(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === "") {
      return [];
    }
    const searched = searchItems(trimmedQuery, searchDataset);
    return sortSearchResults(searched);
  }, [query]);

  const handleSelect = React.useCallback((item: SearchResult) => {
    setOpen(false);
    setQuery("");
    if (item.url) {
      router.push(item.url);
    }
  }, [router]);

  return (
    <>
      <SearchTrigger onClick={() => setOpen(true)} />
      <SearchDialog
        open={open}
        onOpenChange={handleOpenChange}
        query={query}
        onQueryChange={setQuery}
        results={results}
        onSelect={handleSelect}
      />
    </>
  );
}