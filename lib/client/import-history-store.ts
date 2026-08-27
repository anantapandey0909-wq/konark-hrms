/**
 * Client external store for Import History (AuditLog-backed).
 *
 * useSyncExternalStore requires getSnapshot() to return a referentially stable
 * value until the store changes. We expose a numeric `version` as the snapshot
 * (primitives are always stable under Object.is). Job data is read from module
 * state after the version bumps.
 */

import { fetchImportHistory } from "@/lib/data/import-history";
import type { HistoryJobItem } from "@/lib/services/import-history.service";

const EMPTY_JOBS: HistoryJobItem[] = [];

let version = 0;
let jobs: HistoryJobItem[] | null = null;
let error: string | null = null;
let loadPromise: Promise<void> | null = null;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Snapshot for useSyncExternalStore — integer, stable until store changes. */
export function getImportHistoryVersion(): number {
  return version;
}

/** Server snapshot — always 0 (loading / no data yet). */
export function getImportHistoryServerVersion(): number {
  return 0;
}

export function subscribeImportHistory(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

/** Current jobs; null means not loaded yet. */
export function getImportHistoryJobs(): HistoryJobItem[] | null {
  return jobs;
}

export function getImportHistoryError(): string | null {
  return error;
}

export function getImportHistoryJobsOrEmpty(): HistoryJobItem[] {
  return jobs ?? EMPTY_JOBS;
}

/**
 * Start a single shared load. Safe to call from useEffect repeatedly.
 * Bumps version exactly once when the async result settles.
 */
export function ensureImportHistoryLoaded(): void {
  if (loadPromise) return;

  loadPromise = fetchImportHistory()
    .then((data) => {
      jobs = data;
      error = null;
      version += 1;
      emit();
    })
    .catch((err: unknown) => {
      jobs = EMPTY_JOBS;
      error =
        err instanceof Error
          ? err.message
          : "Failed to load import history.";
      version += 1;
      emit();
    });
}
