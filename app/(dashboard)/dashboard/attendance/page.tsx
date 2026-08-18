import type { AttendanceWithEmployee } from "@/types/attendance";
import { fetchAttendanceList } from "@/lib/data/attendance";
import { AttendancePageClient } from "./attendance-page-client";

/**
 * Server Component: load attendance once for the initial render.
 * Avoids client useEffect + setState (react-hooks/set-state-in-effect).
 * Mock vs real is handled inside fetchAttendanceList via feature flag.
 */
export default async function AttendancePage() {
  let initialData: AttendanceWithEmployee[] = [];

  try {
    initialData = await fetchAttendanceList();
  } catch {
    // Unauthenticated / mock-auth without cookie: empty list.
    initialData = [];
  }

  return <AttendancePageClient initialData={initialData} />;
}
