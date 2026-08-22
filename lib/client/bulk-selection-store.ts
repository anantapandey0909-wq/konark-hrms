/**
 * Client-only bulk employee selection store backed by sessionStorage.
 * Use with React useSyncExternalStore — no useEffect setState needed.
 */

import { BULK_SELECTED_EMPLOYEE_IDS_KEY } from "@/types/bulk-operation";

const CHANGE_EVENT = "konark-bulk-selection-change";

export function getBulkSelectionSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return sessionStorage.getItem(BULK_SELECTED_EMPLOYEE_IDS_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function getBulkSelectionServerSnapshot(): string {
  return "[]";
}

export function subscribeBulkSelection(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CHANGE_EVENT, handler);
  };
}

export function parseBulkSelectionSnapshot(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

/** Persist selection and notify same-tab subscribers. */
export function writeBulkSelectionIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(BULK_SELECTED_EMPLOYEE_IDS_KEY, JSON.stringify(ids));
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearBulkSelectionIds(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(BULK_SELECTED_EMPLOYEE_IDS_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
