'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Network, Info, ShieldAlert, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import BulkOperationCard from './bulk-operation-card';
import BulkActionSelector from './bulk-action-selector';
import BulkPreviewTable from './bulk-preview-table';
import BulkOperationSummary from './bulk-operation-summary';
import BulkJobHistory from './bulk-job-history';
import {
  previewBulkEmployees,
  executeBulkEmployees,
} from '@/lib/data/bulk-employee';
import { fetchDepartments } from '@/lib/data/departments';
import { fetchEmployees } from '@/lib/data/employees';
import type { Department } from '@/types/department';
import type { Employee } from '@/types/employee';
import {
  type BulkEmployeeAction,
  type BulkEmployeeOperationInput,
  type BulkEmployeePreviewResult,
} from '@/types/bulk-operation';
import {
  clearBulkSelectionIds,
  getBulkSelectionServerSnapshot,
  getBulkSelectionSnapshot,
  parseBulkSelectionSnapshot,
  subscribeBulkSelection,
  writeBulkSelectionIds,
} from '@/lib/client/bulk-selection-store';

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

function parsePreviewInputFromKey(
  key: string
): BulkEmployeeOperationInput | null {
  if (!key) return null;
  const idx = key.indexOf('::');
  const payload = idx >= 0 ? key.slice(idx + 2) : key;
  try {
    return JSON.parse(payload) as BulkEmployeeOperationInput;
  } catch {
    return null;
  }
}

function bulkActionPastTense(action: BulkEmployeeAction): string {
  switch (action) {
    case 'activate':
      return 'activated';
    case 'deactivate':
      return 'deactivated';
    case 'transfer-dept':
      return 'transferred';
    case 'assign-manager':
      return 'updated';
    default:
      return 'updated';
  }
}

export default function BulkOperationsDashboard() {
  const [selectedAction, setSelectedAction] =
    useState<BulkEmployeeAction>('activate');
  const [isCommitting, setIsCommitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [targetDepartmentId, setTargetDepartmentId] = useState('');
  const [targetManagerId, setTargetManagerId] = useState('');
  const [preview, setPreview] = useState<BulkEmployeePreviewResult | null>(
    null
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewEpoch, setPreviewEpoch] = useState(0);

  const selectionSnapshot = useSyncExternalStore(
    subscribeBulkSelection,
    getBulkSelectionSnapshot,
    getBulkSelectionServerSnapshot
  );
  const selectedIds = useMemo(
    () => parseBulkSelectionSnapshot(selectionSnapshot),
    [selectionSnapshot]
  );

  const previewRequestGen = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [depts, emps] = await Promise.all([
          fetchDepartments(),
          fetchEmployees({ status: 'ACTIVE' }),
        ]);
        if (!cancelled) {
          setDepartments(depts);
          setManagers(emps);
        }
      } catch {
        if (!cancelled) {
          setDepartments([]);
          setManagers([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const needsDepartment = selectedAction === 'transfer-dept';
  const needsManager = selectedAction === 'assign-manager';

  const canRequestPreview = useMemo(() => {
    if (selectedIds.length === 0) return false;
    if (needsDepartment && !targetDepartmentId) return false;
    if (needsManager && !targetManagerId) return false;
    return true;
  }, [
    selectedIds.length,
    needsDepartment,
    needsManager,
    targetDepartmentId,
    targetManagerId,
  ]);

  const previewInput = useMemo((): BulkEmployeeOperationInput | null => {
    if (!canRequestPreview) return null;
    return {
      action: selectedAction,
      employeeIds: selectedIds,
      targetDepartmentId: needsDepartment ? targetDepartmentId : null,
      targetManagerId: needsManager ? targetManagerId : null,
    };
  }, [
    canRequestPreview,
    selectedAction,
    selectedIds,
    needsDepartment,
    needsManager,
    targetDepartmentId,
    targetManagerId,
  ]);

  /** Stable key: changes when action, selection, targets, or post-commit epoch change. */
  const previewRequestKey = useMemo(() => {
    if (!previewInput) return '';
    return `${previewEpoch}::${JSON.stringify(previewInput)}`;
  }, [previewInput, previewEpoch]);

  // Load preview AFTER render. Never call server actions during render —
  // use() + server actions update Next.js Router mid-render of BulkPreviewPanel.
  useEffect(() => {
    const gen = ++previewRequestGen.current;
    let cancelled = false;
    const input = parsePreviewInputFromKey(previewRequestKey);

    void (async () => {
      // Yield so setState is not synchronous inside the effect body.
      await Promise.resolve();
      if (cancelled || previewRequestGen.current !== gen) return;

      if (!input) {
        setPreview(null);
        setIsPreviewLoading(false);
        return;
      }

      setIsPreviewLoading(true);
      try {
        const result = await previewBulkEmployees(input);
        if (cancelled || previewRequestGen.current !== gen) return;
        setPreview(result);
      } catch (error: unknown) {
        if (cancelled || previewRequestGen.current !== gen) return;
        setPreview(null);
        toast.error(
          error instanceof Error ? error.message : 'Failed to build preview.'
        );
      } finally {
        if (!cancelled && previewRequestGen.current === gen) {
          setIsPreviewLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [previewRequestKey]);

  const handleSelectAction = (action: BulkEmployeeAction) => {
    setSelectedAction(action);
  };

  const clearSelection = () => {
    clearBulkSelectionIds();
  };

  const canCommit =
    !!preview &&
    preview.canCommit &&
    !isCommitting &&
    !isPreviewLoading &&
    selectedIds.length > 0;

  const handleCommit = useCallback(async () => {
    if (!preview?.canCommit || !previewInput) return;
    const confirmed = window.confirm(
      `Commit ${preview.validCount} employee change(s) for action "${selectedAction}"? This cannot be undone from this screen.`
    );
    if (!confirmed) return;

    setIsCommitting(true);
    try {
      const result = await executeBulkEmployees(previewInput);

      // Remove only successfully processed (valid) IDs from the shared selection.
      // Skipped / warning rows stay selected so the user can act on them later.
      const processedIdSet = new Set(
        preview.rows
          .filter((r) => r.status === 'valid')
          .map((r) => r.employeeId)
      );
      const remainingIds = selectedIds.filter((id) => !processedIdSet.has(id));
      if (remainingIds.length === 0) {
        clearBulkSelectionIds();
      } else {
        writeBulkSelectionIds(remainingIds);
      }

      const verb = bulkActionPastTense(selectedAction);
      const n = result.processedCount;
      const empWord = n === 1 ? 'employee' : 'employees';
      const skipped = preview.skippedCount ?? 0;
      let successMsg = `${n} ${empWord} ${verb} successfully.`;
      if (skipped > 0) {
        successMsg += ` ${skipped} skipped.`;
      }
      toast.success(successMsg);

      // Refresh preview only from the commit event path — never during render.
      setPreviewEpoch((e) => e + 1);
    } catch (error) {
      // Keep selection intact so the user can retry after a failed commit.
      toast.error(
        error instanceof Error ? error.message : 'Bulk commit failed.'
      );
    } finally {
      setIsCommitting(false);
    }
  }, [preview, previewInput, selectedAction, selectedIds]);

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Network className="h-4 w-4" />
            <span>Core Enterprise Batch Actions Workspace</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bulk Operations Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Execute organization-wide employee updates safely. Select employees
            in the directory, choose a supported action, review the preview, and
            confirm the batch commit.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-200">
          <Users className="h-4 w-4 text-indigo-500" />
          <span>
            Selected employees:{' '}
            <strong className="font-mono">{selectedIds.length}</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/employees"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Open Employee Directory
          </Link>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <motion.div variants={blockVariants} className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Target Operations
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <BulkOperationCard />
          </div>
        </motion.div>

        <motion.div variants={blockVariants}>
          <BulkActionSelector
            selectedActionId={selectedAction}
            onSelectAction={handleSelectAction}
          />
        </motion.div>

        {(needsDepartment || needsManager) && (
          <motion.div
            variants={blockVariants}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 space-y-3"
          >
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
              Action parameters
            </p>
            {needsDepartment && (
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-500">
                  Target department
                </span>
                <select
                  className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs px-3"
                  value={targetDepartmentId}
                  onChange={(e) => setTargetDepartmentId(e.target.value)}
                  aria-label="Target department"
                >
                  <option value="">Select department…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </label>
            )}
            {needsManager && (
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-500">
                  Target manager
                </span>
                <select
                  className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs px-3"
                  value={targetManagerId}
                  onChange={(e) => setTargetManagerId(e.target.value)}
                  aria-label="Target manager"
                >
                  <option value="">Select manager…</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.employeeId})
                    </option>
                  ))}
                </select>
              </label>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <motion.div variants={blockVariants} className="lg:col-span-2">
            <BulkPreviewTable
              selectedActionId={selectedAction}
              rows={preview?.rows ?? []}
              isLoading={isPreviewLoading}
            />
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={blockVariants}>
              <BulkOperationSummary
                selectedCount={preview?.selectedCount ?? selectedIds.length}
                validCount={preview?.validCount ?? 0}
                warningCount={preview?.warningCount ?? 0}
                invalidCount={preview?.invalidCount ?? 0}
                skippedCount={preview?.skippedCount ?? 0}
              />
            </motion.div>

            <motion.div
              variants={blockVariants}
              className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex gap-3 text-xs text-indigo-800 dark:text-indigo-400"
            >
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Execution Boundary Guards</span>
                <p className="leading-relaxed text-[11px] text-indigo-700/90 dark:text-indigo-400/90">
                  All mutations are tenant-scoped and transactional. Invalid rows
                  block commit. No-op rows are skipped with warnings.
                </p>
              </div>
            </motion.div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col gap-4">
              <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-455 items-start">
                <ShieldAlert className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
                <p className="leading-normal text-[11px]">
                  {selectedIds.length === 0
                    ? 'Select employees in the Employee Directory before committing.'
                    : 'Review the preview, then confirm the batch commit.'}
                </p>
              </div>

              <button
                type="button"
                disabled={!canCommit}
                onClick={() => void handleCommit()}
                className={
                  canCommit
                    ? 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm text-center inline-flex items-center justify-center gap-2'
                    : 'px-4 py-2 bg-indigo-600/50 dark:bg-indigo-500/50 text-white rounded-lg text-xs font-bold shadow-sm cursor-not-allowed select-none text-center inline-flex items-center justify-center gap-2'
                }
              >
                {isCommitting && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {isCommitting ? 'Committing…' : 'Trigger Batch Commit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div variants={blockVariants}>
        <BulkJobHistory />
      </motion.div>
    </motion.div>
  );
}
