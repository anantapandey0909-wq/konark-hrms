import type { AuthUser } from "@/types/auth";

/**
 * Extends the production AuthUser model with local, mock-only credentials.
 * Ensures strict alignment with session contexts while preserving local verification fields.
 */
export interface MockAuthUser extends AuthUser {
  readonly password?: string;
}

export const mockUsers: readonly MockAuthUser[] = [
  {
    loginId: "ananta_pandey",
    firstName: "Ananta",
    lastName: "Pandey",
    email: "ananta.pandey@konarktech.co.in",
    role: "ADMIN",
    password: "password123",
    isSuperAdmin: false,
    tenant: {
      id: "tenant-konark-tech",
      name: "Konark Technologies",
      slug: "konark-tech"
    },
    allowedTenants: [
      { id: "tenant-konark-tech", name: "Konark Technologies", slug: "konark-tech" }
    ]
  },
  {
    loginId: "rita_sharma",
    firstName: "Rita",
    lastName: "Sharma",
    email: "hr@konarktech.co.in",
    role: "HR",
    password: "password123",
    isSuperAdmin: false,
    tenant: {
      id: "tenant-konark-tech",
      name: "Konark Technologies",
      slug: "konark-tech"
    }
  },
  {
    loginId: "amit_patel",
    firstName: "Amit",
    lastName: "Patel",
    email: "accountant@ayurcare.com",
    role: "ACCOUNTANT",
    password: "password123",
    isSuperAdmin: false,
    tenant: {
      id: "tenant-ayurcare",
      name: "AyurCare Wellness",
      slug: "ayurcare"
    }
  },
  {
    loginId: "rajesh_kumar",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "manager@shaktiauto.com",
    role: "MANAGER",
    password: "password123",
    isSuperAdmin: false,
    tenant: {
      id: "tenant-shakti-auto",
      name: "Shakti Auto Components",
      slug: "shakti-auto"
    }
  },
  {
    loginId: "sanjay_verma",
    firstName: "Sanjay",
    lastName: "Verma",
    email: "supervisor@shaktiauto.com",
    role: "SUPERVISOR",
    password: "password123",
    isSuperAdmin: false,
    tenant: {
      id: "tenant-shakti-auto",
      name: "Shakti Auto Components",
      slug: "shakti-auto"
    }
  },
  {
    loginId: "deepak_singh",
    firstName: "Deepak",
    lastName: "Singh",
    email: "employee@konarktech.co.in",
    role: "EMPLOYEE",
    password: "password123",
    isSuperAdmin: false,
    tenant: {
      id: "tenant-konark-tech",
      name: "Konark Technologies",
      slug: "konark-tech"
    }
  },
  {
    loginId: "system_operator",
    firstName: "System",
    lastName: "Operator",
    email: "superadmin@konark.io",
    role: "ADMIN",
    password: "password123",
    isSuperAdmin: true,
    tenant: {
      id: "tenant-konark-tech",
      name: "Konark Technologies",
      slug: "konark-tech"
    },
    allowedTenants: [
      { id: "tenant-konark-tech", name: "Konark Technologies", slug: "konark-tech" },
      { id: "tenant-shakti-auto", name: "Shakti Auto Components", slug: "shakti-auto" },
      { id: "tenant-ayurcare", name: "AyurCare Wellness", slug: "ayurcare" }
    ]
  }
];