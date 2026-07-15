import { mockEmployees } from '@/mock/employee';
import type { EmployeeMetrics } from '@/types/report-metrics';
/**
 * Builds aggregated employee metrics for the Reports module
 * from the current employee dataset.
 *
 * @returns Aggregated employee metrics.
 */
export function calculateEmployeeMetrics(): EmployeeMetrics {
  const totalEmployees = mockEmployees.length;
  let activeEmployees = 0;
  let inactiveEmployees = 0;
  let suspendedEmployees = 0;
  let onLeaveEmployees = 0;

  for (const employee of mockEmployees) {
    switch (employee.status) {
      case 'ACTIVE':
        activeEmployees++;
        break;
      case 'INACTIVE':
        inactiveEmployees++;
        break;
      case 'SUSPENDED':
        suspendedEmployees++;
        break;
      case 'ON_LEAVE':
        onLeaveEmployees++;
        break;
      default:
  // Future-proof: ignore any unsupported status values.

        break;
    }
  }

  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    suspendedEmployees,
    onLeaveEmployees,
  };
}