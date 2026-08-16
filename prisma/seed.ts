/**
 * Development seed for Konark HRMS.
 * Creates realistic core + transactional data aligned with mock shapes.
 * Phase 3: passwords stored as Argon2id hashes only.
 *
 * Usage: npx prisma db seed  (requires DATABASE_URL)
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Konark HRMS...");

  // --------------------------------------------------------------------------
  // Roles
  // --------------------------------------------------------------------------
  const roleAdmin = await prisma.role.upsert({
    where: { roleCode: "ROLE-ADMIN" },
    update: {},
    create: {
      roleCode: "ROLE-ADMIN",
      roleName: "ADMIN",
      description: "System administrator with full access",
    },
  });

  const roleHr = await prisma.role.upsert({
    where: { roleCode: "ROLE-HR" },
    update: {},
    create: {
      roleCode: "ROLE-HR",
      roleName: "HR",
      description: "Human resources manager",
    },
  });

  const roleManager = await prisma.role.upsert({
    where: { roleCode: "ROLE-MANAGER" },
    update: {},
    create: {
      roleCode: "ROLE-MANAGER",
      roleName: "MANAGER",
      description: "Department manager",
    },
  });

  const roleEmployee = await prisma.role.upsert({
    where: { roleCode: "ROLE-EMPLOYEE" },
    update: {},
    create: {
      roleCode: "ROLE-EMPLOYEE",
      roleName: "EMPLOYEE",
      description: "Standard employee",
    },
  });

  // --------------------------------------------------------------------------
  // Companies (tenants)
  // --------------------------------------------------------------------------
  const konark = await prisma.company.upsert({
    where: { companyCode: "COMP-001" },
    update: {},
    create: {
      companyCode: "COMP-001",
      companyName: "Konark Enterprises Pvt. Ltd.",
      email: "admin@konark.org",
      phone: "+91 9286336309",
      website: "https://konark.org",
      registrationNumber: "CIN-U72900KA2020PTC001",
      baseCurrency: "INR",
      timezone: "Asia/Kolkata",
      address: "100 Tech Park",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      postalCode: "560001",
      status: "ACTIVE",
    },
  });

  const shakti = await prisma.company.upsert({
    where: { companyCode: "COMP-002" },
    update: {},
    create: {
      companyCode: "COMP-002",
      companyName: "Shakti Auto Components",
      email: "hr@shaktiauto.in",
      phone: "+91 9876500099",
      website: "https://shaktiauto.in",
      registrationNumber: "CIN-U34100MH2018PTC002",
      baseCurrency: "INR",
      timezone: "Asia/Kolkata",
      address: "Pune MIDC Area",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      postalCode: "411019",
      status: "ACTIVE",
    },
  });

  // --------------------------------------------------------------------------
  // Departments (Konark)
  // --------------------------------------------------------------------------
  const depEng = await prisma.department.upsert({
    where: { departmentCode: "DEP-001" },
    update: {},
    create: {
      departmentCode: "DEP-001",
      departmentName: "Engineering",
      description: "Product engineering",
      companyId: konark.id,
    },
  });

  const depHr = await prisma.department.upsert({
    where: { departmentCode: "DEP-002" },
    update: {},
    create: {
      departmentCode: "DEP-002",
      departmentName: "Human Resources",
      description: "People operations",
      companyId: konark.id,
    },
  });

  await prisma.department.upsert({
    where: { departmentCode: "DEP-003" },
    update: {},
    create: {
      departmentCode: "DEP-003",
      departmentName: "Operations",
      description: "Operations and facilities",
      companyId: konark.id,
    },
  });

  // --------------------------------------------------------------------------
  // Users + Employees — passwords hashed with Argon2id
  // Development credentials (plaintext only in this comment / local docs):
  //   ananta@konark.org / admin123
  //   h.sharma@konark.org / hr123456
  //   a.swamy@konark.org / manager123
  //   rahul.verma@konark.org / employee123
  // --------------------------------------------------------------------------
  async function ensureUserEmployee(opts: {
    userCode: string;
    email: string;
    password: string;
    roleId: string;
    companyId: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    designation: string;
    departmentId: string;
    employmentType?: "FULL_TIME" | "PART_TIME" | "INTERN" | "CONTRACT";
  }) {
    const passwordHash = await hashPassword(opts.password);

    const user = await prisma.user.upsert({
      where: { email: opts.email },
      update: {
        // Re-hash on re-seed so local password changes stay consistent
        password: passwordHash,
        accountStatus: "ACTIVE",
        failedLoginAttempts: 0,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
      create: {
        userCode: opts.userCode,
        email: opts.email,
        password: passwordHash,
        companyId: opts.companyId,
        roleId: opts.roleId,
        isEmailVerified: true,
        accountStatus: "ACTIVE",
      },
    });

    const employee = await prisma.employee.upsert({
      where: { employeeCode: opts.employeeCode },
      update: {},
      create: {
        employeeCode: opts.employeeCode,
        firstName: opts.firstName,
        lastName: opts.lastName,
        email: opts.email,
        phone: opts.phone,
        gender: opts.gender,
        dateOfBirth: new Date("1990-01-15"),
        designation: opts.designation,
        employmentType: opts.employmentType ?? "FULL_TIME",
        joiningDate: new Date("2022-06-01"),
        companyId: opts.companyId,
        departmentId: opts.departmentId,
        userId: user.id,
        status: "ACTIVE",
      },
    });

    return { user, employee };
  }

  const admin = await ensureUserEmployee({
    userCode: "USER-ADMIN",
    email: "ananta@konark.org",
    password: "admin123",
    roleId: roleAdmin.id,
    companyId: konark.id,
    employeeCode: "EMP-0001",
    firstName: "Ananta",
    lastName: "Pandey",
    phone: "+91 9286336309",
    gender: "MALE",
    designation: "System Administrator",
    departmentId: depHr.id,
  });

  await ensureUserEmployee({
    userCode: "USER-HR",
    email: "h.sharma@konark.org",
    password: "hr123456",
    roleId: roleHr.id,
    companyId: konark.id,
    employeeCode: "EMP-0128",
    firstName: "Harshita",
    lastName: "Sharma",
    phone: "+91 9876543210",
    gender: "FEMALE",
    designation: "HR Manager",
    departmentId: depHr.id,
  });

  const manager = await ensureUserEmployee({
    userCode: "USER-MANAGER",
    email: "a.swamy@konark.org",
    password: "manager123",
    roleId: roleManager.id,
    companyId: konark.id,
    employeeCode: "EMP-0012",
    firstName: "Arvind",
    lastName: "Swamy",
    phone: "+91 9876500012",
    gender: "MALE",
    designation: "Engineering Manager",
    departmentId: depEng.id,
  });

  const employee = await ensureUserEmployee({
    userCode: "USER-EMP",
    email: "rahul.verma@konark.org",
    password: "employee123",
    roleId: roleEmployee.id,
    companyId: konark.id,
    employeeCode: "EMP-0456",
    firstName: "Rahul",
    lastName: "Verma",
    phone: "+91 9876512345",
    gender: "MALE",
    designation: "Software Engineer",
    departmentId: depEng.id,
  });

  await prisma.employee.update({
    where: { id: employee.employee.id },
    data: { managerId: manager.employee.id },
  });

  await prisma.department.update({
    where: { id: depEng.id },
    data: { managerId: manager.employee.id },
  });

  await ensureUserEmployee({
    userCode: "USER-SHAKTI-HR",
    email: "ops@shaktiauto.in",
    password: "shakti123",
    roleId: roleHr.id,
    companyId: shakti.id,
    employeeCode: "EMP-S001",
    firstName: "Priya",
    lastName: "Deshmukh",
    phone: "+91 9876500088",
    gender: "FEMALE",
    designation: "Plant HR",
    departmentId: (
      await prisma.department.upsert({
        where: { departmentCode: "DEP-S01" },
        update: {},
        create: {
          departmentCode: "DEP-S01",
          departmentName: "Plant Operations",
          companyId: shakti.id,
        },
      })
    ).id,
  });

  // --------------------------------------------------------------------------
  // Attendance sample
  // --------------------------------------------------------------------------
  const attDate = new Date("2025-01-15");

  await prisma.attendance.upsert({
    where: {
      employeeId_attendanceDate: {
        employeeId: employee.employee.id,
        attendanceDate: attDate,
      },
    },
    update: {},
    create: {
      companyId: konark.id,
      employeeId: employee.employee.id,
      attendanceDate: attDate,
      checkIn: new Date("2025-01-15T09:02:14.000Z"),
      checkOut: new Date("2025-01-15T18:15:30.000Z"),
      totalHours: 9.22,
      overtimeHours: 1.22,
      breakDuration: 45,
      status: "PRESENT",
      workMode: "OFFICE",
      location: "Bangalore Office",
      shiftName: "General Shift",
      isRegularized: false,
      remarks: "Standard operations.",
    },
  });

  await prisma.attendance.upsert({
    where: {
      employeeId_attendanceDate: {
        employeeId: manager.employee.id,
        attendanceDate: attDate,
      },
    },
    update: {},
    create: {
      companyId: konark.id,
      employeeId: manager.employee.id,
      attendanceDate: attDate,
      checkIn: new Date("2025-01-15T09:00:00.000Z"),
      checkOut: new Date("2025-01-15T18:00:00.000Z"),
      totalHours: 9,
      overtimeHours: 1,
      breakDuration: 60,
      status: "PRESENT",
      workMode: "OFFICE",
      location: "Bangalore Office",
      shiftName: "General Shift",
    },
  });

  // --------------------------------------------------------------------------
  // Leave balances + requests
  // --------------------------------------------------------------------------
  const year = new Date().getFullYear();

  await prisma.leaveBalance.upsert({
    where: {
      employeeId_year: { employeeId: employee.employee.id, year },
    },
    update: {},
    create: {
      companyId: konark.id,
      employeeId: employee.employee.id,
      year,
      casualLeave: 12,
      sickLeave: 8,
      earnedLeave: 15,
      maternityLeave: 0,
      paternityLeave: 0,
      compOff: 2,
    },
  });

  const existingLeave = await prisma.leaveRequest.findFirst({
    where: {
      employeeId: employee.employee.id,
      reason: "Annual family vacation out of station",
    },
  });

  if (!existingLeave) {
    await prisma.leaveRequest.create({
      data: {
        companyId: konark.id,
        employeeId: employee.employee.id,
        leaveType: "EARNED_LEAVE",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-11"),
        totalDays: 11,
        reason: "Annual family vacation out of station",
        appliedOn: new Date("2024-12-20"),
        status: "APPROVED",
        approvedById: manager.employee.id,
        approvedOn: new Date("2024-12-22"),
        approvalRemarks: "Approved",
      },
    });
  }

  const pendingLeave = await prisma.leaveRequest.findFirst({
    where: {
      employeeId: employee.employee.id,
      status: "PENDING",
      reason: "Family religious rituals in hometown",
    },
  });

  if (!pendingLeave) {
    await prisma.leaveRequest.create({
      data: {
        companyId: konark.id,
        employeeId: employee.employee.id,
        leaveType: "CASUAL_LEAVE",
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-03"),
        totalDays: 3,
        reason: "Family religious rituals in hometown",
        appliedOn: new Date("2025-02-20"),
        status: "PENDING",
      },
    });
  }

  // --------------------------------------------------------------------------
  // Payroll sample
  // --------------------------------------------------------------------------
  await prisma.payroll.upsert({
    where: { payrollNumber: "PAY-2025-01-EMP-0456" },
    update: {},
    create: {
      payrollNumber: "PAY-2025-01-EMP-0456",
      companyId: konark.id,
      employeeId: employee.employee.id,
      employeeCode: employee.employee.employeeCode,
      employeeName: `${employee.employee.firstName} ${employee.employee.lastName}`,
      designation: employee.employee.designation,
      departmentName: "Engineering",
      month: "JANUARY",
      year: 2025,
      status: "PAID",
      payPeriodStart: new Date("2025-01-01"),
      payPeriodEnd: new Date("2025-01-31"),
      basicSalary: 50000,
      totalAllowances: 15000,
      totalDeductions: 8000,
      grossSalary: 65000,
      taxableIncome: 60000,
      netSalary: 57000,
      allowances: [
        { id: "a1", name: "HRA", amount: 10000 },
        { id: "a2", name: "Transport", amount: 5000 },
      ],
      deductions: [
        { id: "d1", name: "PF", amount: 6000 },
        { id: "d2", name: "Professional Tax", amount: 2000 },
      ],
      attendanceSummary: {
        workingDays: 22,
        presentDays: 20,
        absentDays: 1,
        paidLeaveDays: 1,
        unpaidLeaveDays: 0,
        overtimeHours: 4,
        lateEntries: 1,
      },
      leaveSummary: {
        totalLeaves: 1,
        paidLeaves: 1,
        unpaidLeaves: 0,
        leaveWithoutPayDays: 0,
      },
      generatedAt: new Date("2025-02-01T10:00:00.000Z"),
      paidAt: new Date("2025-02-05T10:00:00.000Z"),
      notes: "January 2025 payroll",
    },
  });

  // --------------------------------------------------------------------------
  // Notifications
  // --------------------------------------------------------------------------
  const notifCount = await prisma.notification.count({
    where: { companyId: konark.id, userId: employee.user.id },
  });

  if (notifCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          companyId: konark.id,
          userId: employee.user.id,
          title: "Leave approved",
          message: "Your earned leave request has been approved.",
          category: "LEAVE",
          priority: "MEDIUM",
          isRead: false,
          href: "/dashboard/leave",
        },
        {
          companyId: konark.id,
          userId: employee.user.id,
          title: "Payslip ready",
          message: "January 2025 payslip is available.",
          category: "PAYROLL",
          priority: "LOW",
          isRead: true,
          href: "/dashboard/employee/payroll",
          readAt: new Date("2025-02-06T08:00:00.000Z"),
        },
        {
          companyId: konark.id,
          userId: manager.user.id,
          title: "Pending leave approval",
          message: "Rahul Verma has a pending casual leave request.",
          category: "LEAVE",
          priority: "HIGH",
          isRead: false,
          href: "/dashboard/manager/approvals",
        },
      ],
    });
  }

  await prisma.setting.upsert({
    where: {
      companyId_section_key: {
        companyId: konark.id,
        section: "attendance",
        key: "gracePeriodMinutes",
      },
    },
    update: {},
    create: {
      companyId: konark.id,
      section: "attendance",
      key: "gracePeriodMinutes",
      value: 15,
    },
  });

  await prisma.setting.upsert({
    where: {
      companyId_section_key: {
        companyId: konark.id,
        section: "general",
        key: "timezone",
      },
    },
    update: {},
    create: {
      companyId: konark.id,
      section: "general",
      key: "timezone",
      value: "Asia/Kolkata",
    },
  });

  const docCount = await prisma.document.count({
    where: { companyId: konark.id, employeeId: employee.employee.id },
  });

  if (docCount === 0) {
    await prisma.document.create({
      data: {
        companyId: konark.id,
        employeeId: employee.employee.id,
        name: "Offer Letter.pdf",
        type: "CONTRACT",
        url: "/uploads/mock/offer-letter-emp-0456.pdf",
        mimeType: "application/pdf",
        sizeBytes: 245760,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      companyId: konark.id,
      actorId: admin.user.id,
      action: "SEED",
      entity: "System",
      entityId: null,
      metadata: { phase: 3, message: "Seed completed with hashed passwords" },
    },
  });

  console.log("Seed completed successfully.");
  console.log({
    companies: [konark.companyCode, shakti.companyCode],
    roles: [
      roleAdmin.roleName,
      roleHr.roleName,
      roleManager.roleName,
      roleEmployee.roleName,
    ],
    note: "Development passwords are hashed in the database. See project README / Phase 3 docs for local credentials.",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
