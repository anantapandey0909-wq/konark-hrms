import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Placeholder until AuditLog is mapped to a dashboard activity feed.
 * Intentionally does not invent fake events.
 */
export function RecentActivity() {
  return (
    <Card className="border border-zinc-200/70 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No recent activity
        </p>
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          Operational history is available under Data Management → History.
        </p>
      </CardContent>
    </Card>
  );
}
