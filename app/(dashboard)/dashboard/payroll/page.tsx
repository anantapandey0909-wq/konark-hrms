import { PayrollDashboard } from "@/components/payroll/payroll-dashboard";
import {
  fetchPayrollRecords,
  fetchPayrollStats,
} from "@/lib/data/payroll";
import { fetchDepartments } from "@/lib/data/departments";
import type { PayrollRecord, PayrollStats } from "@/types/payroll";
import type { ResolvedDepartment } from "@/types/department";

export const dynamic = "force-dynamic";

export default async function PayrollPage() {
  let initialRecords: PayrollRecord[] = [];
  let initialStats: PayrollStats | null = null;
  let initialDepartments: ResolvedDepartment[] = [];
  let loadError: string | null = null;

  try {
    const [records, dash, depts] = await Promise.all([
      fetchPayrollRecords(),
      fetchPayrollStats(),
      fetchDepartments(),
    ]);
    initialRecords = records;
    initialStats = dash.stats;
    initialDepartments = depts;
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load payroll data.";
  }

  return (
    <div className="space-y-2">
      {loadError && (
        <div className="mx-6 mt-4 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      )}
      <PayrollDashboard
        initialRecords={initialRecords}
        initialStats={initialStats}
        initialDepartments={initialDepartments}
      />
    </div>
  );
}
