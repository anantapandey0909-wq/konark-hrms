"use client";

// ============================================================================
// 1. Imports
// ============================================================================
import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateEmployeeMetrics,
  getAttendanceMetrics,
  calculateLeaveMetrics,
  getPayrollMetrics,
} from "@/lib/reports";

// ============================================================================
// 2. Types
// ============================================================================
interface MetricRowProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  indicatorColor?: string;
}

// ============================================================================
// 3. Animation Constants
// ============================================================================
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// ============================================================================
// 4. Helper Components
// ============================================================================
function MetricRow({
  label,
  value,
  icon,
  indicatorColor,
}: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/30 px-2 rounded-md transition-colors">
      <div className="flex items-center gap-2.5">
        {indicatorColor && (
          <span className={`h-2.5 w-2.5 rounded-full ${indicatorColor}`} />
        )}
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}

// ============================================================================
// 5. Formatting Helpers
// ============================================================================
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

const formatHours = (value: number): string => {
  return `${value.toLocaleString()} hrs`;
};

// ============================================================================
// 6. ReportsOverview Component
// ============================================================================
export function ReportsOverview() {
  const employeeMetrics = calculateEmployeeMetrics();
  const attendanceMetrics = getAttendanceMetrics();
  const leaveMetrics = calculateLeaveMetrics();
  const payrollMetrics = getPayrollMetrics();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* 1. Employee Overview */}
      <motion.div variants={itemVariants}>
        <Card className="h-full shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">Employee Distribution</CardTitle>
              <CardDescription className="text-xs">Real-time breakdown of workforce status</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <MetricRow label="Total Employees" value={employeeMetrics.totalEmployees} />
            <MetricRow label="Active Employees" value={employeeMetrics.activeEmployees} indicatorColor="bg-emerald-500" />
            <MetricRow label="Inactive Employees" value={employeeMetrics.inactiveEmployees} indicatorColor="bg-slate-400" />
            <MetricRow label="Suspended Employees" value={employeeMetrics.suspendedEmployees} indicatorColor="bg-destructive" />
            <MetricRow label="Employees On Leave" value={employeeMetrics.onLeaveEmployees} indicatorColor="bg-amber-500" />
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. Attendance Overview */}
      <motion.div variants={itemVariants}>
        <Card className="h-full shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">Attendance & Activity</CardTitle>
              <CardDescription className="text-xs">Daily tracking and workload thresholds</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <MetricRow label="Attendance Rate" value={formatPercent(attendanceMetrics.attendanceRate)} />
            <MetricRow label="Present Count" value={attendanceMetrics.presentCount} indicatorColor="bg-emerald-500" />
            <MetricRow label="Absent Count" value={attendanceMetrics.absentCount} indicatorColor="bg-destructive" />
            <MetricRow label="Late Count" value={attendanceMetrics.lateCount} indicatorColor="bg-amber-500" />
            <MetricRow label="Average Work Hours" value={`${attendanceMetrics.averageWorkHours}h/day`} />
            <MetricRow label="Total Overtime Hours" value={formatHours(attendanceMetrics.totalOvertimeHours)} />
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. Leave Overview */}
      <motion.div variants={itemVariants}>
        <Card className="h-full shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">Leave Management</CardTitle>
              <CardDescription className="text-xs">Summary of requests and approvals</CardDescription>
            </div>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <MetricRow label="Total Requests" value={leaveMetrics.totalRequests} />
            <MetricRow label="Pending Requests" value={leaveMetrics.pendingRequests} indicatorColor="bg-amber-500" />
            <MetricRow label="Approved Requests" value={leaveMetrics.approvedRequests} indicatorColor="bg-emerald-500" />
            <MetricRow label="Rejected Requests" value={leaveMetrics.rejectedRequests} indicatorColor="bg-destructive" />
            <MetricRow label="Cancelled Requests" value={leaveMetrics.cancelledRequests} indicatorColor="bg-slate-400" />
          </CardContent>
        </Card>
      </motion.div>

      {/* 4. Payroll Overview */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">Payroll & Compensation</CardTitle>
              <CardDescription className="text-xs">Financial summaries of processing cycles</CardDescription>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Financial Breakdown</h4>
                <MetricRow label="Gross Salary" value={formatCurrency(payrollMetrics.totalGrossSalary)} icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-500" />} />
                <MetricRow label="Net Salary" value={formatCurrency(payrollMetrics.totalNetSalary)} icon={<DollarSign className="h-3.5 w-3.5 text-primary" />} />
                <MetricRow label="Total Allowances" value={formatCurrency(payrollMetrics.totalAllowances)} indicatorColor="bg-sky-500" />
                <MetricRow label="Total Deductions" value={formatCurrency(payrollMetrics.totalDeductions)} indicatorColor="bg-destructive" />
                <MetricRow label="Average Net Salary" value={formatCurrency(payrollMetrics.averageNetSalary)} />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Cycle Performance</h4>
                <MetricRow label="Employee Count" value={payrollMetrics.employeeCount} />
                <MetricRow label="Total Payroll Records" value={payrollMetrics.totalPayrollRecords} />
                <MetricRow label="Paid Payroll" value={payrollMetrics.paidPayroll} indicatorColor="bg-emerald-500" />
                <MetricRow label="Approved Payroll" value={payrollMetrics.approvedPayroll} indicatorColor="bg-teal-500" />
                <MetricRow label="Pending Payroll" value={payrollMetrics.pendingPayroll} indicatorColor="bg-amber-500" />
                <MetricRow label="Draft Payroll" value={payrollMetrics.draftPayroll} indicatorColor="bg-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}