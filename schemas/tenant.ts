import { z } from "zod";
import {
  TENANT_STATUSES,
  SUBSCRIPTION_PLANS,
  COMPANY_SIZES,
} from "@/types/tenant";

/**
 * Reusable enum validation schemas mapped from core tenant types.
 */
export const tenantStatusSchema = z.enum(TENANT_STATUSES);

export const subscriptionPlanSchema = z.enum(SUBSCRIPTION_PLANS);

export const companySizeSchema = z.enum(COMPANY_SIZES);

/**
 * Enterprise validation schema covering all foundational Tenant attributes.
 */
const baseTenantSchema = z.object({
  id: z.string().min(1, "Tenant ID is required"),
  name: z.string().min(2, "Company name must be at least 2 characters"),
  legalName: z.string().min(2, "Legal company name must be at least 2 characters").nullable(),
  slug: z
    .string()
    .min(2, "Workspace slug is required")
    .max(50, "Slug cannot exceed 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  logo: z.string().url("Logo must be a valid URL").nullable(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Phone number must follow international format (e.g., +918049123456)")
    .nullable(),
  website: z.string().url("Website must be a valid URL").nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().min(1, "Country field is required"),
  postalCode: z.string().nullable(),
  timezone: z.string().min(1, "A timezone is required for operational synchronization"),
  currency: z.string().min(1, "Please select an operational currency"),
  fiscalYearStart: z
    .string()
    .regex(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Fiscal year start must follow MM-DD format"),
  industry: z.string().nullable(),
  companySize: companySizeSchema,
  status: tenantStatusSchema,
  subscriptionPlan: subscriptionPlanSchema,
  createdAt: z.string().datetime("Invalid creation timestamp format"),
  updatedAt: z.string().datetime("Invalid update timestamp format"),
});

/**
 * Main Tenant validation schema, exported directly from the base object representation.
 */
export const tenantSchema = baseTenantSchema;

/**
 * Schema intended for tenant onboarding and registration flows.
 */
export const createTenantSchema = baseTenantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema intended for system adjustments and tenant profile configurations.
 */
export const updateTenantSchema = createTenantSchema.partial();

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
