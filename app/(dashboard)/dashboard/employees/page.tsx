'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Employee, EmployeeFilters } from '@/types/employee';
import { mockEmployees } from '@/mock/employee';
import { Toolbar } from '@/components/employee/table/toolbar';
import { EmployeeTable } from '@/components/employee/table/employee-table';
import { motion } from 'framer-motion';

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = React.useState<Employee[]>(mockEmployees);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [filters, setFilters] = React.useState<EmployeeFilters>({
    search: '',
    department: 'ALL',
    status: 'ALL',
    role: 'ALL',
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = React.useCallback(
  (employee: Employee) => {
    router.push(`/dashboard/employees/${employee.id}/edit`);
  },
  [router]
);

  const handleDeactivate = React.useCallback((id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: 'INACTIVE',
            }
          : emp
      )
    );
  }, []);

  const handleAddClick = React.useCallback(() => {
    router.push('/dashboard/employees/new');
  }, [router]);

  const handleExportClick = React.useCallback(() => {
    console.log('Export Employees');
  }, []);

  const filteredEmployees = React.useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.designation.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDepartment =
        filters.department === 'ALL' ||
        emp.department === filters.department;

      const matchesStatus =
        filters.status === 'ALL' ||
        emp.status === filters.status;

      const matchesRole =
        filters.role === 'ALL' ||
        emp.role === filters.role;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [employees, filters]);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-64px)] bg-neutral-50/40 dark:bg-neutral-950/20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Employee Directory
        </h1>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
          Manage system accessibility levels, dynamic roles, personal
          information records, and workspace status updates.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
        className="space-y-4"
      >
        <Toolbar
          filters={filters}
          onFilterChange={setFilters}
          onAddClick={handleAddClick}
          onExportClick={handleExportClick}
        />

        <EmployeeTable
          data={filteredEmployees}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />
      </motion.div>
    </div>
  );
}
