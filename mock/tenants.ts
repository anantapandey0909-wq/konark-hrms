import { Tenant } from "@/types/tenant";

export const mockTenants: readonly Tenant[] = [
  {
    id: "tenant-konark-tech",
    name: "Konark Technologies",
    legalName: "Konark Technologies Private Limited",
    slug: "konark-tech",
    logo: null,
    email: "contact@konarktech.co.in",
    phone: "+91 80 4912 3456",
    website: "https://www.konarktech.co.in",
    address: "Prestige Tech Park, Outer Ring Road",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560103",
    timezone: "Asia/Kolkata",
    currency: "INR",
    fiscalYearStart: "04-01", // Indian standard fiscal cycle (April 1st)
    industry: "Information Technology",
    companySize: "1000+",
    status: "ACTIVE",
    subscriptionPlan: "ENTERPRISE",
    createdAt: "2024-01-10T09:00:00.000Z",
    updatedAt: "2025-01-15T14:30:00.000Z",
  },
  {
    id: "tenant-shakti-auto",
    name: "Shakti Auto Components",
    legalName: "Shakti Auto Components Limited",
    slug: "shakti-auto",
    logo: null,
    email: "info@shaktiauto.com",
    phone: "+91 20 2712 9876",
    website: "https://www.shaktiauto.com",
    address: "MIDC Industrial Area, Bhosari",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    postalCode: "411026",
    timezone: "Asia/Kolkata",
    currency: "INR",
    fiscalYearStart: "04-01",
    industry: "Manufacturing",
    companySize: "201-1000",
    status: "ACTIVE",
    subscriptionPlan: "PROFESSIONAL",
    createdAt: "2024-02-15T11:20:00.000Z",
    updatedAt: "2025-01-10T10:15:00.000Z",
  },
  {
    id: "tenant-ayurcare",
    name: "AyurCare Wellness",
    legalName: "AyurCare Wellness and Hospitals Group",
    slug: "ayurcare",
    logo: null,
    email: "care@ayurcarehospitals.com",
    phone: "+91 484 234 5678",
    website: "https://www.ayurcarehospitals.com",
    address: "MG Road, Ernakulam",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    postalCode: "682016",
    timezone: "Asia/Kolkata",
    currency: "INR",
    fiscalYearStart: "04-01",
    industry: "Healthcare",
    companySize: "51-200",
    status: "ACTIVE",
    subscriptionPlan: "PROFESSIONAL",
    createdAt: "2024-05-20T08:00:00.000Z",
    updatedAt: "2025-01-12T16:45:00.000Z",
  },
  {
    id: "tenant-namaste-retail",
    name: "Namaste Organics",
    legalName: "Namaste Retail & Organic Products Pvt Ltd",
    slug: "namaste-organics",
    logo: null,
    email: "partner@namasteorganics.in",
    phone: "+91 22 2640 1234",
    website: "https://www.namasteorganics.in",
    address: "Linking Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400050",
    timezone: "Asia/Kolkata",
    currency: "INR",
    fiscalYearStart: "04-01",
    industry: "Retail",
    companySize: "11-50",
    status: "ACTIVE",
    subscriptionPlan: "STARTER",
    createdAt: "2024-08-01T10:00:00.000Z",
    updatedAt: "2025-01-05T09:30:00.000Z",
  },
  {
    id: "tenant-indus-academy",
    name: "Indus Academy",
    legalName: "Indus Academy of Advanced Education",
    slug: "indus-academy",
    logo: null,
    email: "admin@indusacademy.edu.in",
    phone: "+91 11 2584 5678",
    website: "https://www.indusacademy.edu.in",
    address: "Pusa Road, Karol Bagh",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    postalCode: "110005",
    timezone: "Asia/Kolkata",
    currency: "INR",
    fiscalYearStart: "04-01",
    industry: "Education",
    companySize: "51-200",
    status: "ACTIVE",
    subscriptionPlan: "PROFESSIONAL",
    createdAt: "2024-03-12T09:15:00.000Z",
    updatedAt: "2025-01-14T11:00:00.000Z",
  },
  {
    id: "tenant-veda-consulting",
    name: "Veda Consulting",
    legalName: "Veda Advisory Services Pvt Ltd",
    slug: "veda-consulting",
    logo: null,
    email: "hello@vedaconsulting.com",
    phone: "+91 40 4012 5678",
    website: "https://www.vedaconsulting.com",
    address: "HITECH City, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    postalCode: "500081",
    timezone: "Asia/Kolkata",
    currency: "INR",
    fiscalYearStart: "04-01",
    industry: "Professional Services",
    companySize: "1-10",
    status: "SUSPENDED",
    subscriptionPlan: "FREE",
    createdAt: "2024-11-01T14:00:00.000Z",
    updatedAt: "2025-01-02T15:20:00.000Z",
  },
  {
    id: "tenant-thar-logistics",
    name: "Thar Logistics",
    legalName: "Thar Logistics & Supply Chain Pvt Ltd",
    slug: "thar-logistics",
    logo: null,
    email: "onboarding@tharlogistics.in",
    phone: "+91 141 4056 789",
    website: "https://www.tharlogistics.in",
    address: "MI Road",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    postalCode: "302001",
    timezone: "Asia/Kolkata",
    currency: "INR",
    fiscalYearStart: "04-01",
    industry: "Logistics",
    companySize: "11-50",
    status: "PENDING",
    subscriptionPlan: "STARTER",
    createdAt: "2025-01-15T12:00:00.000Z",
    updatedAt: "2025-01-15T12:00:00.000Z",
  }
];

/**
 * Safely retrieves a tenant profile by its unique string identifier.
 */
export function getTenantById(id: string | null | undefined): Tenant | undefined {
  if (!id) return undefined;
  return mockTenants.find((tenant) => tenant.id === id);
}

/**
 * Safely retrieves a tenant profile by its unique routing path slug.
 */
export function getTenantBySlug(slug: string | null | undefined): Tenant | undefined {
  if (!slug) return undefined;
  return mockTenants.find((tenant) => tenant.slug === slug);
}

/**
 * Filters the immutable static tenants to active instances only.
 */
export function getActiveTenants(): readonly Tenant[] {
  return mockTenants.filter((tenant) => tenant.status === "ACTIVE");
}

/**
 * Safely resolves a tenant's descriptive name. Returns null if not found.
 */
export function getTenantName(id: string | null | undefined): string | null {
  if (!id) return null;
  const tenant = getTenantById(id);
  return tenant ? tenant.name : null;
}