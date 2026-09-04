"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WeeklyAttendancePoint } from "@/lib/services/admin-dashboard.service";

type Props = {
  data: WeeklyAttendancePoint[];
};

export function AttendanceChart({ data }: Props) {
  return (
    <Card className="border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <CardTitle className="text-lg font-semibold">
            Attendance Overview
          </CardTitle>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Employee attendance for the current week
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="attendanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="#e4e4e7"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ stroke: "#f59e0b", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e4e4e7",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.10)",
                }}
              />

              <Area
                type="monotone"
                dataKey="present"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#attendanceGradient)"
                activeDot={{
                  r: 5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
