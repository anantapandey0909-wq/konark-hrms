/**
 * Map Prisma Employee rows ↔ frontend Employee contract.
 * Fields not stored in Phase 1 schema (workLocation, relievingDate) are
 * surfaced as null so the existing UI keeps working unchanged.
 */

import type { Employee, EmployeeStatus, EmploymentType } from "@/types/employee";
import type { EmployeeStatus as PrismaEmployeeStatus, EmploymentType as PrismaEmploymentType } from "@prisma/client";

export type PrismaEmployeeRow = {
  id: string;
  companyId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  designation: string;
  employmentType: PrismaEmploymentType;
  status: PrismaEmployeeStatus;
  joiningDate: Date;
  departmentId: string;
  managerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toFrontendEmployeeStatus(
  status: PrismaEmployeeStatus
): EmployeeStatus {
  switch (status) {
    case "ACTIVE":
      return "ACTIVE";
    case "ON_LEAVE":
      return "ON_LEAVE";
    case "TERMINATED":
      return "TERMINATED";
    case "RESIGNED":
      return "INACTIVE";
    default:
      return "ACTIVE";
  }
}

export function toPrismaEmployeeStatus(
  status: EmployeeStatus
): PrismaEmployeeStatus {
  switch (status) {
    case "ACTIVE":
      return "ACTIVE";
    case "ON_LEAVE":
      return "ON_LEAVE";
    case "TERMINATED":
      return "TERMINATED";
    case "INACTIVE":
      return "RESIGNED";
    default:
      return "ACTIVE";
  }
}

export function toFrontendEmploymentType(
  type: PrismaEmploymentType
): EmploymentType {
  return type as EmploymentType;
}

export function toPrismaEmploymentType(
  type: EmploymentType
): PrismaEmploymentType {
  return type as PrismaEmploymentType;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function mapEmployeeToFrontend(row: PrismaEmployeeRow): Employee {
  return {
    id: row.id,
    tenantId: row.companyId,
    employeeId: row.employeeCode,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone || null,
    avatarUrl: row.profileImage,
    departmentId: row.departmentId,
    managerId: row.managerId,
    designation: row.designation,
    status: toFrontendEmployeeStatus(row.status),
    employmentType: toFrontendEmploymentType(row.employmentType),
    workLocation: null,
    joiningDate: isoDate(row.joiningDate),
    relievingDate: null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
