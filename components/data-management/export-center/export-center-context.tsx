"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  downloadBase64File,
  executeExport,
  fetchExportHistory,
  fetchExportModules,
  previewExportBatch,
} from "@/lib/data/export";
import type {
  ExportFormat,
  ExportHistoryItem,
  ExportModule,
  ExportModuleSummary,
  ExportPreviewResult,
} from "@/lib/validation/export";

interface ExportCenterContextValue {
  modules: ExportModuleSummary[];
  selectedModule: ExportModule;
  selectedFormat: ExportFormat;
  preview: ExportPreviewResult | null;
  history: ExportHistoryItem[];
  isLoadingModules: boolean;
  isPreviewing: boolean;
  isGenerating: boolean;
  setSelectedModule: (m: ExportModule) => void;
  setSelectedFormat: (f: ExportFormat) => void;
  generate: () => Promise<void>;
  refreshHistory: () => Promise<void>;
}

const ExportCenterContext = createContext<ExportCenterContextValue | null>(
  null
);

function selectionKey(module: ExportModule, format: ExportFormat): string {
  return module + "|" + format;
}

export function ExportCenterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modules, setModules] = useState<ExportModuleSummary[]>([]);
  const [selectedModule, setSelectedModule] =
    useState<ExportModule>("employees");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [preview, setPreview] = useState<ExportPreviewResult | null>(null);
  /** Key for which selection the current `preview` / last completed load applies. */
  const [previewSettledKey, setPreviewSettledKey] = useState<string | null>(
    null
  );
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewSeq = useRef(0);

  const currentKey = selectionKey(selectedModule, selectedFormat);
  // Derived: true until async preview for this selection has settled.
  const isPreviewing = previewSettledKey !== currentKey;

  const refreshHistory = useCallback(async () => {
    try {
      const rows = await fetchExportHistory();
      setHistory(rows);
    } catch {
      // History is non-blocking
    }
  }, []);

  // Load modules once on mount. Initial isLoadingModules=true; only clear after async.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await fetchExportModules();
        if (cancelled) return;
        setModules(list);
        const first = list.find((m) => m.available);
        if (first) setSelectedModule(first.id);
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load export modules."
          );
        }
      } finally {
        if (!cancelled) setIsLoadingModules(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initial history load (async result only — no sync setState at effect entry).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await fetchExportHistory();
        if (!cancelled) setHistory(rows);
      } catch {
        // non-blocking
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Preview: fire async request; settle key only after response (derived loading).
  useEffect(() => {
    const seq = ++previewSeq.current;
    const key = selectionKey(selectedModule, selectedFormat);
    let cancelled = false;

    void (async () => {
      try {
        const result = await previewExportBatch({
          module: selectedModule,
          format: selectedFormat,
        });
        if (cancelled || previewSeq.current !== seq) return;
        setPreview(result);
        setPreviewSettledKey(key);
      } catch (error) {
        if (cancelled || previewSeq.current !== seq) return;
        setPreview(null);
        setPreviewSettledKey(key);
        toast.error(
          error instanceof Error ? error.message : "Preview failed."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedModule, selectedFormat]);

  const generate = useCallback(async () => {
    if (!preview?.canExport) {
      toast.error(preview?.message ?? "Nothing to export.");
      return;
    }

    if (selectedModule === "payroll") {
      const ok = window.confirm(
        "You are about to export payroll records for your organization.\nContinue?"
      );
      if (!ok) return;
    } else {
      const ok = window.confirm(
        "Generate " +
          selectedFormat.toUpperCase() +
          " export for " +
          preview.totalRows.toLocaleString() +
          " record(s)?"
      );
      if (!ok) return;
    }

    setIsGenerating(true);
    try {
      const result = await executeExport({
        module: selectedModule,
        format: selectedFormat,
      });
      downloadBase64File(
        result.filename,
        result.mimeType,
        result.contentBase64
      );
      toast.success(
        "Exported " +
          result.recordCount.toLocaleString() +
          " row(s) as " +
          result.filename +
          "."
      );
      await refreshHistory();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Export generation failed."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [preview, selectedModule, selectedFormat, refreshHistory]);

  const value = useMemo(
    () => ({
      modules,
      selectedModule,
      selectedFormat,
      preview,
      history,
      isLoadingModules,
      isPreviewing,
      isGenerating,
      setSelectedModule,
      setSelectedFormat,
      generate,
      refreshHistory,
    }),
    [
      modules,
      selectedModule,
      selectedFormat,
      preview,
      history,
      isLoadingModules,
      isPreviewing,
      isGenerating,
      generate,
      refreshHistory,
    ]
  );

  return (
    <ExportCenterContext.Provider value={value}>
      {children}
    </ExportCenterContext.Provider>
  );
}

export function useExportCenter() {
  const ctx = useContext(ExportCenterContext);
  if (!ctx) {
    throw new Error("useExportCenter must be used within ExportCenterProvider");
  }
  return ctx;
}
