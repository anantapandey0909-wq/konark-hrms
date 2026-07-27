import { ImportModule, FileType, ImportStatus, ExportStatus } from '@/types/data-management';

export const SUPPORTED_FILE_EXTENSIONS: FileType[] = ['csv', 'xlsx', 'xls'];

export const MAX_UPLOAD_SIZE = 10485760; // 10 MB in Bytes

export const ALLOWED_MODULES: ImportModule[] = [
  'employees',
  'attendance',
  'payroll',
  'leave',
  'departments',
  'holidays',
];

export const SUPPORTED_EXPORT_FORMATS: FileType[] = ['csv', 'xlsx'];

export const IMPORT_STATUS_VALUES: ImportStatus[] = [
  'completed',
  'failed',
  'partial',
  'processing',
  'idle',
];

export const EXPORT_STATUS_VALUES: ExportStatus[] = [
  'completed',
  'failed',
  'processing',
];

export const MODULE_LABELS: Record<ImportModule, string> = {
  employees: 'Employees',
  attendance: 'Attendance',
  payroll: 'Payroll',
  leave: 'Leave Requests',
  departments: 'Departments',
  holidays: 'Holidays',
};