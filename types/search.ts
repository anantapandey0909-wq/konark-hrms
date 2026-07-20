/**
 * Supported core functional domains of Konark HRMS used for search grouping and indexing.
 */
export type SearchCategory =
  | "employees"
  | "departments"
  | "attendance"
  | "leave"
  | "payroll"
  | "support"
  | "navigation";

/**
 * Standardized structure representing a unified search record indexed from various system modules.
 */
export interface SearchResult {
  /** Unique key identifying the search item across all indexes */
  id: string;
  
  /** Primary label of the item, matching core fields like names, codes, or subjects */
  title: string;
  
  /** Optional secondary context descriptive of the target item */
  subtitle?: string;
  
  /** The application domain category the record belongs to */
  category: SearchCategory;
  
  /** Target routing URL within the system */
  url: string;
  
  /** Key-value dictionary of primitive types used for structural queries or additional deep matching */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Structured group container used to partition SearchResults by category in the UI.
 */
export interface SearchGroup {
  /** The parent system category */
  category: SearchCategory;
  
  /** Sorted and filtered list of search results under this category */
  items: SearchResult[];
}