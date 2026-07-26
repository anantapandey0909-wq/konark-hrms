import { SearchResult, SearchGroup, SearchCategory } from "@/types/search";

/**
 * Searches a list of SearchResults against a text query.
 * Matches are case-insensitive and scan across title, subtitle, and metadata values.
 * 
 * @param query The search term entered by the user.
 * @param items The index array of searchable items.
 * @returns A filtered array of matched SearchResult items.
 */
export function searchItems(query: string, items: SearchResult[]): SearchResult[] {
  const sanitizedQuery = query.trim().toLowerCase();
  if (!sanitizedQuery) {
    return [];
  }

  return items.filter((item) => {
    const matchTitle = item.title.toLowerCase().includes(sanitizedQuery);
    const matchSubtitle = item.subtitle?.toLowerCase().includes(sanitizedQuery) ?? false;
    
    const matchMetadata = item.metadata
     

    return matchTitle || matchSubtitle || matchMetadata;
  });
}

/**
 * Sorts an array of search results alphabetically by their primary title.
 * 
 * @param results The search results to sort.
 * @returns A new sorted array of SearchResult items.
 */
export function sortSearchResults(results: SearchResult[]): SearchResult[] {
  return [...results].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Group search results under their respective operational domains.
 * Maintains a stable visual hierarchy according to predefined category order.
 * 
 * @param results Flat list of search results.
 * @returns Array of grouped SearchGroup items.
 */
export function groupSearchResults(results: SearchResult[]): SearchGroup[] {
  const groupsMap = new Map<SearchCategory, SearchResult[]>();

  // Distribute items into mapped arrays
  results.forEach((item) => {
    const list = groupsMap.get(item.category) ?? [];
    list.push(item);
    groupsMap.set(item.category, list);
  });

  // Predefined sorting hierarchy for predictable UI categories
  const categoryOrder: SearchCategory[] = [
    "navigation",
    "employees",
    "departments",
    "attendance",
    "leave",
    "payroll",
    "support",
  ];

  const grouped: SearchGroup[] = [];

  // 1. Process matching categories in the preferred order
  categoryOrder.forEach((category) => {
    const items = groupsMap.get(category);
    if (items && items.length > 0) {
      grouped.push({
        category,
        items: sortSearchResults(items),
      });
    }
  });

  // 2. Append any residual categories that fall outside the order array
  groupsMap.forEach((items, category) => {
    if (!categoryOrder.includes(category) && items.length > 0) {
      grouped.push({
        category,
        items: sortSearchResults(items),
      });
    }
  });

  return grouped;
}