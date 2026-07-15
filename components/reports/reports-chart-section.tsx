"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  BarChart3,
  Users,
  Clock,
  CalendarDays,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChartCardConfig {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const chartCards: ChartCardConfig[] = [
  {
    id: "employee",
    title: "Employee Analytics",
    description: "Workforce distribution by department and operational status",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    id: "attendance",
    title: "Attendance Trends",
    description: "Monthly presence rates, anomalies, and active work hours",
    icon: <Clock className="h-4 w-4 text-muted-foreground" />,
  },
  {
    id: "leave",
    title: "Leave Analytics",
    description: "Distribution of leave types and seasonal trends",
    icon: <CalendarDays className="h-4 w-4 text-muted-foreground" />,
  },
  {
    id: "payroll",
    title: "Payroll Analytics",
    description: "Historical compensation cycles and financial allocation",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  },
];

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

export function ReportsChartSection() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
    >
      {chartCards.map((card) => (
        <motion.div key={card.id} variants={itemVariants}>
          <Card className="shadow-xs hover:shadow-sm transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
              <div>
                <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                <CardDescription className="text-xs">{card.description}</CardDescription>
              </div>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 text-center p-6 select-none">
                <div className="p-3 rounded-full bg-background border border-border shadow-xs mb-3 text-muted-foreground/60">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">Chart coming soon</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Interactive analytics charts will be available in a future sprint.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}