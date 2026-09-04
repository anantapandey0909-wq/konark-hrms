import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminRecentHire } from "@/lib/services/admin-dashboard.service";

type Props = {
  employees: AdminRecentHire[];
};

export function RecentEmployees({ employees }: Props) {
  return (
    <Card className="border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-lg font-semibold">Recent Employees</CardTitle>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Employees who recently joined your organization.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {employees.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">
            No employees found for this organization yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {employee.designation}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-zinc-600 dark:text-zinc-300">
                    {employee.departmentName}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "ACTIVE" ? "secondary" : "outline"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-6 text-right text-zinc-500">
                    {employee.joiningDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
