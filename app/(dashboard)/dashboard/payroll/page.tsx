import { PayrollDashboard } from "@/components/payroll/payroll-dashboard";
import {
  fetchPayrollRecords,
  fetchPayrollStats,
} from "@/lib/data/payroll";
import { fetchDepartments } from "@/lib/data/departments";
import type { PayrollRecord, PayrollStats } from "@/types/payroll";
import type { ResolvedDepartment } from "@/types/department";

export const dynamic = "force-dynamic";

const INITIAL_PAGE = 1;
const INITIAL_PAGE_SIZE = 10;

export default async function PayrollPage() {
  let initialRecords: PayrollRecord[] = [];
  let initialTotal = 0;
  let initialPage = INITIAL_PAGE;
  let initialPageSize = INITIAL_PAGE_SIZE;
  let initialStats: PayrollStats | null = null;
  let initialDepartments: ResolvedDepartment[] = [];
  let loadError: string | null = null;

  try {
    const [listResult, dash, depts] = await Promise.all([
      fetchPayrollRecords({ page: INITIAL_PAGE, pageSize: INITIAL_PAGE_SIZE }),
      fetchPayrollStats(),
      fetchDepartments(),
    ]);
    initialRecords = listResult.items;
    initialTotal = listResult.total;
    initialPage = listResult.page;
    initialPageSize = listResult.pageSize;
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
        initialTotal={initialTotal}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
        initialStats={initialStats}
        initialDepartments={initialDepartments}
      />
    </div>
  );
}
