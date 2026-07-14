import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface LeaveSummaryCardProps {
  title: string;
  value: React.ReactNode;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  iconContainerClassName: string;
}

export default function LeaveSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  iconContainerClassName,
}: LeaveSummaryCardProps) {
  return (
    <Card className="overflow-hidden border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex h-full min-h-28 flex-col justify-between p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
          </div>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${iconContainerClassName}`}
          >
            <Icon
              aria-hidden="true"
              className={`h-4 w-4 ${iconClassName}`}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-bold tracking-tight">
            {value}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
