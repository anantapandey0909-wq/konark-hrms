import type { SupportTicket, SupportFiltersState, SupportMetrics, SupportCategory } from "@/types/support";

export const DEFAULT_SUPPORT_FILTERS: SupportFiltersState = {
  search: "",
  status: "ALL",
  priority: "ALL",
  category: "ALL",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function calculateSupportMetrics(
  tickets: SupportTicket[]
): SupportMetrics {
  const metrics: SupportMetrics = {
    total: tickets.length,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  for (const ticket of tickets) {
    switch (ticket.status) {
      case "OPEN":
        metrics.open++;
        break;

      case "IN_PROGRESS":
        metrics.inProgress++;
        break;

      case "RESOLVED":
        metrics.resolved++;
        break;

      case "CLOSED":
        metrics.closed++;
        break;
    }
  }

  return metrics;
}

export function formatCategory(category: SupportCategory): string {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDate(dateValue: string | Date): string {
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function searchSupportTickets(tickets: SupportTicket[], search: string): SupportTicket[] {
  const query = search.toLowerCase().trim();
  if (!query) return tickets;

  return tickets.filter((ticket) => {
    const employeeName = ticket.employee?.fullName.toLowerCase() || "";
    const employeeEmail = ticket.employee?.email.toLowerCase() || "";

    return (
      ticket.ticketNumber.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      employeeName.includes(query) ||
      employeeEmail.includes(query)
    );
  });
}

export function filterSupportTickets(
  tickets: SupportTicket[],
  status: SupportFiltersState["status"],
  priority: SupportFiltersState["priority"],
  category: SupportFiltersState["category"]
): SupportTicket[] {
  return tickets.filter((ticket) => {
    if (status !== "ALL" && ticket.status !== status) return false;
    if (priority !== "ALL" && ticket.priority !== priority) return false;
    if (category !== "ALL" && ticket.category !== category) return false;
    return true;
  });
}

export function sortSupportTickets(
  tickets: SupportTicket[],
  sortBy: SupportFiltersState["sortBy"],
  sortOrder: SupportFiltersState["sortOrder"]
): SupportTicket[] {
  return [...tickets].sort((a, b) => {
    let valA: string | number = "";
    let valB: string | number = "";

    switch (sortBy) {
      case "createdAt":
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
        break;

      case "updatedAt":
        valA = new Date(a.updatedAt).getTime();
        valB = new Date(b.updatedAt).getTime();
        break;

      case "priority": {
        const weights = {
          URGENT: 4,
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
        };

        valA = weights[a.priority];
        valB = weights[b.priority];
        break;
      }

      case "status":
        valA = a.status;
        valB = b.status;
        break;

      case "employeeName":
        valA = a.employeeName.toLowerCase();
        valB = b.employeeName.toLowerCase();
        break;

      default:
        valA = "";
        valB = "";
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;

    return 0;
  });
}