import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { LeaveType, LeaveStatus } from "@/types/leave";
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS } from "@/constants/leave";

interface LeaveFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeaveStatus | "ALL";
  onStatusChange: (value: LeaveStatus | "ALL") => void;
  typeFilter: LeaveType | "ALL";
  onTypeChange: (value: LeaveType | "ALL") => void;
  departments: string[];
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
}

const LEAVE_TYPE_OPTIONS: { value: LeaveType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Leave Types" },
  { value: "CASUAL_LEAVE", label: LEAVE_TYPE_LABELS.CASUAL_LEAVE },
  { value: "SICK_LEAVE", label: LEAVE_TYPE_LABELS.SICK_LEAVE },
  { value: "EARNED_LEAVE", label: LEAVE_TYPE_LABELS.EARNED_LEAVE },
  { value: "MATERNITY_LEAVE", label: LEAVE_TYPE_LABELS.MATERNITY_LEAVE },
  { value: "PATERNITY_LEAVE", label: LEAVE_TYPE_LABELS.PATERNITY_LEAVE },
  { value: "WORK_FROM_HOME", label: LEAVE_TYPE_LABELS.WORK_FROM_HOME },
  { value: "HALF_DAY", label: LEAVE_TYPE_LABELS.HALF_DAY },
  { value: "COMP_OFF", label: LEAVE_TYPE_LABELS.COMP_OFF },
];

const LEAVE_STATUS_OPTIONS: { value: LeaveStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: LEAVE_STATUS_LABELS.PENDING },
  { value: "APPROVED", label: LEAVE_STATUS_LABELS.APPROVED },
  { value: "REJECTED", label: LEAVE_STATUS_LABELS.REJECTED },
  { value: "CANCELLED", label: LEAVE_STATUS_LABELS.CANCELLED },
];

export default function LeaveFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  departments,
  departmentFilter,
  onDepartmentChange
}: LeaveFiltersProps) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 lg:flex-row lg:items-center">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        {/* Search Field */}
        <div >
          <Search
  aria-hidden="true"
  className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"
/>
          <Input
            type="text"
            placeholder="Search employee name or code..."
            value={searchQuery}
            onChange={({ target }) => onSearchChange(target.value)}
            aria-label="Search leave requests"
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>

        {/* Filters Matrix */}
        <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
          {/* Status Selection */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger aria-label="Filter by status" className="w-full h-9 bg-background text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Leave Type Selection */}
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger aria-label="Filter by leave type" className="w-full h-9 bg-background text-xs">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_TYPE_OPTIONS.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Department Selection */}
          <Select value={departmentFilter} onValueChange={onDepartmentChange}>
            <SelectTrigger aria-label="Filter by department" className="h-9 text-xs bg-background w-full">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}