/**
 * Map a Prisma User (with relations) to the stable AuthUser contract.
 * Never include password or reset tokens in the returned object.
 */

import type { AuthRole, AuthUser, AuthUserTenant } from "@/types/auth";
import { tenantSlugFromName } from "@/lib/tenant/tenant-utils";

const ROLE_MAP: Record<string, AuthRole> = {
  ADMIN: "ADMIN",
  HR: "HR",
  ACCOUNTANT: "ACCOUNTANT",
  MANAGER: "MANAGER",
  SUPERVISOR: "SUPERVISOR",
  EMPLOYEE: "EMPLOYEE",
};

export function mapRoleName(roleName: string): AuthRole {
  const key = roleName.trim().toUpperCase();
  return ROLE_MAP[key] ?? "EMPLOYEE";
}

export type PrismaUserForAuth = {
  id: string;
  userCode: string;
  email: string;
  accountStatus: string;
  company: {
    id: string;
    companyName: string;
    companyCode: string;
  };
  role: {
    roleName: string;
  };
  employee: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    profileImage: string | null;
    department: {
      departmentName: string;
    } | null;
  } | null;
};

export function toAuthUser(dbUser: PrismaUserForAuth): AuthUser {
  const tenant: AuthUserTenant = {
    id: dbUser.company.id,
    name: dbUser.company.companyName,
    slug: tenantSlugFromName(dbUser.company.companyCode),
  };

  const emp = dbUser.employee;
  const firstName = emp?.firstName ?? "User";
  const lastName = emp?.lastName ?? "";
  const role = mapRoleName(dbUser.role.roleName);

  return {
    id: dbUser.id,
    loginId: dbUser.userCode,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    email: dbUser.email,
    role,
    employeeId: emp?.employeeCode ?? dbUser.userCode,
    phone: emp?.phone ?? "",
    department: emp?.department?.departmentName ?? "",
    designation: emp?.designation ?? "",
    company: dbUser.company.companyName,
    avatarUrl: emp?.profileImage ?? undefined,
    tenant,
    isSuperAdmin: role === "ADMIN",
    allowedTenants: [tenant],
  };
}
