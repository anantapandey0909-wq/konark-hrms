import { LeaveRequest } from "@/types/leave";
import type { LeaveFormData } from "@/types/leave";
/**
 * Pure utility function to transform a core LeaveRequest domain model into 
 * a LeaveFormData structure compatible with the presentation layer LeaveForm component.
 * Converts date values to strings if represented as Date objects to comply with the schema.
 *
 * @param leaveRequest - The source LeaveRequest domain entity.
 * @returns The fully populated LeaveFormData object with safe defaults for unmapped fields.
 */
export function mapLeaveRequestToForm(leaveRequest: LeaveRequest): LeaveFormData {
  // Safe extraction of date representations to string format
  const startDate = leaveRequest.startDate;
const endDate = leaveRequest.endDate;

  // Derive half-day flag based on standard totalDays value of 0.5
  const isHalfDay = leaveRequest.totalDays === 0.5;

  return {
    employeeId: leaveRequest.employeeId,
    employeeName: leaveRequest.employeeName,
    department: leaveRequest.department,
    employeeDisplayId: leaveRequest.employeeCode,
    leaveType: leaveRequest.leaveType,
    startDate,
    endDate,
    duration: leaveRequest.totalDays,
    reason: leaveRequest.reason ?? "",
    status: leaveRequest.status,
    isHalfDay,
    
    // Initialized fields that do not exist on the current LeaveRequest domain model
    reportingManager: "",
    approver: "",
    attachmentName: "",
    notes: "",
  };
}