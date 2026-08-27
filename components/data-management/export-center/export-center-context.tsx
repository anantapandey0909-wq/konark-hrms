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

export function ExportCenterProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ExportModuleSummary[]>([]);
  const [selectedModule, setSelectedModule] =
    useState<ExportModule>("employees");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [preview, setPreview] = useState<ExportPreviewResult | null>(null);
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewSeq = useRef(0);

  const refreshHistory = useCallback(async () => {
    try {
      const rows = await fetchExportHistory();
      setHistory(rows);
    } catch {
      // History is non-blocking
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setIsLoadingModules(true);
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
    void refreshHistory();
    return () => {
      cancelled = true;
    };
  }, [refreshHistory]);

  useEffect(() => {
    const seq = ++previewSeq.current;
    setIsPreviewing(true);
    void (async () => {
      try {
        const result = await previewExportBatch({
          module: selectedModule,
          format: selectedFormat,
        });
        if (previewSeq.current !== seq) return;
        setPreview(result);
      } catch (error) {
        if (previewSeq.current !== seq) return;
        setPreview(null);
        toast.error(
          error instanceof Error ? error.message : "Preview failed."
        );
      } finally {
        if (previewSeq.current === seq) setIsPreviewing(false);
      }
    })();
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
        `Generate ${selectedFormat.toUpperCase()} export for ${preview.totalRows.toLocaleString()} record(s)?`
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
        `Exported ${result.recordCount.toLocaleString()} row(s) as ${result.filename}.`
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
