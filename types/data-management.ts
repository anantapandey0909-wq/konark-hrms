export type FileType = 'csv' | 'xlsx' | 'xls';

export type ImportStatus = 'completed' | 'failed' | 'partial' | 'processing' | 'idle';

export type ExportStatus = 'completed' | 'failed' | 'processing';

export type ImportModule = 'employees' | 'attendance' | 'payroll' | 'leave' | 'departments' | 'holidays';

export interface ValidationError {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
  value?: string;
}

export interface ImportHistory {
  id: string;
  module: ImportModule;
  fileName: string;
  fileSize: string;
  status: ImportStatus;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ValidationError[];
  importedBy: string;
  completedAt: string;
}

export interface ExportHistory {
  id: string;
  module: ImportModule;
  format: FileType;
  status: ExportStatus;
  recordCount: number;
  exportedBy: string;
  completedAt: string;
}

export interface TemplateFile {
  id: string;
  module: ImportModule;
  fileName: string;
  fileType: FileType;
  fileSize: string;
  lastUpdated: string;
}

export interface ImportStatistics {
  totalImports: number;
  successRate: number;
  validationIssuesCount: number;
  activeTemplates: number;
}

export interface DataModule {
  id: ImportModule;
  name: string;
  description: string;
  recordCount: number;
  lastActivity: string;
  importCount: number;
  exportCount: number;
  status: 'active' | 'maintenance' | 'synced';
  formats: FileType[];
}