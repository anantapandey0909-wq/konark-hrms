import type { AuthUser, AuthUserTenant } from "@/types/auth";

export interface MockAuthUser extends AuthUser {
  readonly password: string;
}

// ==============================================================================
// Shared Tenant
// ==============================================================================

const KONARK_TENANT: AuthUserTenant = {
  id: "tenant-001",
  name: "Konark Enterprises Pvt. Ltd.",
  slug: "konark",
};

// ==============================================================================
// Mock Users
// ==============================================================================

export const mockUsers: MockAuthUser[] = [
  {
    id: "user-admin-001",

    loginId: "admin",
    password: "admin123",

    firstName: "Ananta",
    lastName: "Pandey",
    fullName: "Ananta Pandey",

    email: "ananta@konark.org",

    role: "ADMIN",

    employeeId: "EMP-0001",
    phone: "+91 9286336309",

    department: "Administration",
    designation: "System Administrator",

    company: KONARK_TENANT.name,

    avatarUrl: "",

    tenant: KONARK_TENANT,

    isSuperAdmin: true,

    allowedTenants: [KONARK_TENANT],
  },

  {
    id: "user-hr-001",

    loginId: "hr",
    password: "hr123456",

    firstName: "Harshita",
    lastName: "Sharma",
    fullName: "Harshita Sharma",

    email: "h.sharma@konark.org",

    role: "HR",

    employeeId: "EMP-0128",
    phone: "+91 9876543210",

    department: "Human Resources",
    designation: "HR Manager",

    company: KONARK_TENANT.name,

    avatarUrl: "",

    tenant: KONARK_TENANT,

    isSuperAdmin: false,

    allowedTenants: [KONARK_TENANT],
  },

  {
    id: "user-manager-001",

    loginId: "manager",
    password: "manager123",

    firstName: "Arvind",
    lastName: "Swamy",
    fullName: "Arvind Swamy",

    email: "a.swamy@konark.org",

    role: "MANAGER",

    employeeId: "EMP-0012",
    phone: "+91 9876500012",

    department: "Product & Design",
    designation: "Director of Design",

    company: KONARK_TENANT.name,

    avatarUrl: "",

    tenant: KONARK_TENANT,

    isSuperAdmin: false,

    allowedTenants: [KONARK_TENANT],
  },

  {
    id: "user-employee-001",

    loginId: "employee",
    password: "employee123",

    firstName: "Rahul",
    lastName: "Verma",
    fullName: "Rahul Verma",

    email: "rahul.verma@konark.org",

    role: "EMPLOYEE",

    employeeId: "EMP-0456",
    phone: "+91 9876512345",

    department: "Engineering",
    designation: "Software Engineer",

    company: KONARK_TENANT.name,

    avatarUrl: "",

    tenant: KONARK_TENANT,

    isSuperAdmin: false,

    allowedTenants: [KONARK_TENANT],
  },
];