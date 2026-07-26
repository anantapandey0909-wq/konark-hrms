export type TenantStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export type SubscriptionPlan = "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

export type CompanySize = "1-10" | "11-50" | "51-200" | "201-1000" | "1000+";

/**
 * Read-only runtime lists to support validation schemas, dropdown filters,
 * and form components without duplicating type definitions.
 */
export const TENANT_STATUSES = ["PENDING", "ACTIVE", "SUSPENDED", "DEACTIVATED"] as const satisfies readonly TenantStatus[];

export const SUBSCRIPTION_PLANS = ["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"] as const satisfies readonly SubscriptionPlan[];
export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
] as const satisfies readonly CompanySize[];

/**
 * Foundational Tenant Model representing a unique client workspace.
 * Serves as the partition key for all operational data across the HRMS platform.
 */
export interface Tenant {
  readonly id: string;
  readonly name: string;
  readonly legalName: string | null;
  readonly slug: string; // URL-safe subdomain or path identifier
  readonly logo: string | null;
  readonly email: string;
  readonly phone: string | null;
  readonly website: string | null;
  
  // Physical Location Details
  readonly address: string | null;
  readonly city: string | null;
  readonly state: string | null;
  readonly country: string;
  readonly postalCode: string | null;
  
  // Localization Configurations
  readonly timezone: string; // e.g., "America/New_York", "UTC"
  readonly currency: string; // e.g., "USD", "EUR"
  readonly fiscalYearStart: string; // ISO Month-Day representation, e.g., "01-01"
  
  // Firmographic Identifiers
  readonly industry: string | null;
  readonly companySize: CompanySize;
  
  // Operational Parameters
  readonly status: TenantStatus;
  readonly subscriptionPlan: SubscriptionPlan;
  
  // Temporal Metadata (ISO-8601 UTC string format)
  readonly createdAt: string;
  readonly updatedAt: string;
}