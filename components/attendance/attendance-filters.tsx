import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";
import type { 
  AttendanceFilters as AttendanceFiltersType, 
  AttendanceStatus 
} from "@/types/attendance";

interface AttendanceFiltersProps {
  filters: AttendanceFiltersType;
  onFiltersChange: (filters: AttendanceFiltersType) => void;
  employees: {
    id: string;
    fullName: string;
  }[];
  departments: string[];
  className?: string;
}

/**
 * Presentational, fully controlled filter bar for the Attendance Module.
 * Does not manage state directly; delegates updates and resets to the parent container.
 */
export function AttendanceFilters({
  filters,
  onFiltersChange,
  employees,
  departments,
  className,
}: AttendanceFiltersProps) {
  
  /**
   * Helper to execute state updates immutably.
   */
  const updateFilter = useCallback(
    (updates: Partial<AttendanceFiltersType>) => {
      onFiltersChange({
        ...filters,
        ...updates,
      });
    },
    [filters, onFiltersChange]
  );

  /**
   * Restores all filter keys to undefined to represent an empty state.
   */
  const handleClear = useCallback(() => {
    onFiltersChange({
      employeeId: undefined,
      department: undefined,
      status: undefined,
      location: undefined,
      shiftName: undefined,
      search: undefined,
      startDate: undefined,
      endDate: undefined,
      isRegularized: undefined,
    });
  }, [onFiltersChange]);

  // Determine if any filters are currently active to show/hide the reset button
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5 border rounded-lg bg-card text-card-foreground">
        
        {/* Search Query */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="search-filter">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="search-filter"
              placeholder="Name, code, department..."
              value={filters.search || ""}
              onChange={(e) => updateFilter({ search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        {/* Employee Select */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employee-filter">Employee</Label>
          <Select
            value={filters.employeeId || "ALL"}
            onValueChange={(val) =>
              updateFilter({ employeeId: val === "ALL" ? undefined : val })
            }
          >
            <SelectTrigger id="employee-filter">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department Select */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="department-filter">Department</Label>
          <Select
            value={filters.department || "ALL"}
            onValueChange={(val) =>
              updateFilter({ department: val === "ALL" ? undefined : val })
            }
          >
            <SelectTrigger id="department-filter">
              <SelectValue placeholder="All Departments" />
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

        {/* Status Select */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status || "ALL"}
            onValueChange={(val) =>
              updateFilter({
                status: val === "ALL" ? undefined : (val as AttendanceStatus),
              })
            }
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PRESENT">Present</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="LATE">Late</SelectItem>
              <SelectItem value="HALF_DAY">Half Day</SelectItem>
              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Select */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location-filter">Location</Label>
          <Select
            value={filters.location || "ALL"}
            onValueChange={(val) =>
              updateFilter({ location: val === "ALL" ? undefined : val })
            }
          >
            <SelectTrigger id="location-filter">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Locations</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shift Name Select */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shift-filter">Shift</Label>
          <Select
            value={filters.shiftName || "ALL"}
            onValueChange={(val) =>
              updateFilter({ shiftName: val === "ALL" ? undefined : val })
            }
          >
            <SelectTrigger id="shift-filter">
              <SelectValue placeholder="All Shifts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Shifts</SelectItem>
              <SelectItem value="General Shift">General Shift</SelectItem>
              <SelectItem value="Night Shift">Night Shift</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start-date-filter">Start Date</Label>
          <Input
            id="start-date-filter"
            type="date"
            value={filters.startDate || ""}
            onChange={(e) =>
              updateFilter({ startDate: e.target.value || undefined })
            }
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end-date-filter">End Date</Label>
          <Input
            id="end-date-filter"
            type="date"
            value={filters.endDate || ""}
            onChange={(e) =>
              updateFilter({ endDate: e.target.value || undefined })
            }
          />
        </div>

        {/* Regularization Select */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="regularized-filter">Regularization</Label>
          <Select
            value={
              filters.isRegularized === undefined
                ? "ALL"
                : filters.isRegularized
                ? "TRUE"
                : "FALSE"
            }
            onValueChange={(val) =>
              updateFilter({
                isRegularized:
                  val === "ALL" ? undefined : val === "TRUE",
              })
            }
          >
            <SelectTrigger id="regularized-filter">
              <SelectValue placeholder="All Records" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Records</SelectItem>
              <SelectItem value="TRUE">Regularized Only</SelectItem>
              <SelectItem value="FALSE">Non-Regularized</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Button Container */}
        <div className="flex items-end lg:col-span-3">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}