"use client";

import * as React from "react";
import { ProfileHeader } from "./profile-header";
import { ProfileCompletion } from "./profile-completion";
import { PersonalInformation } from "./personal-information";
import { EmploymentInformation } from "./employment-information";
import { AddressInformation } from "./address-information";
import { EmergencyContact } from "./emergency-contact";
import { DocumentsSummary } from "./documents-summary";

// Combined mock dataset reflecting secure view-only enterprise profile fields
const mockDetailedProfile = {
  personal: {
    dob: "1994-08-14",
    gender: "Male" as const,
    maritalStatus: "Married" as const,
    nationality: "Indian",
    personalEmail: "arjun.sharma.personal@gmail.com",
    personalPhone: "+91 98765 43210",
    bloodGroup: "O+",
  },
  employment: {
    employeeCode: "KON-9402",
    designation: "Senior Software Engineer",
    department: "Product Engineering",
    joinDate: "2022-04-12",
    workLocation: "Noida, India (Hybrid)",
    managerName: "Neha Gupta",
    employmentType: "Full-Time Permanent",
    gradeLevel: "L4 - Senior Engineer",
  },
  address: {
    present: {
      street: "Flat 402, Block C, Maple Heights",
      city: "Sector 62, Noida",
      state: "Uttar Pradesh",
      country: "India",
      zipCode: "201301",
    },
    permanent: {
      street: "House No. 128, Civil Lines",
      city: "Meerut",
      state: "Uttar Pradesh",
      country: "India",
      zipCode: "250001",
    },
  },
  emergency: {
    name: "Pooja Sharma",
    relationship: "Spouse",
    phone: "+91 98765 43211",
    email: "pooja.sharma@outlook.com",
  },
  documents: [
    { id: "doc-1", name: "Aadhaar Card", type: "Identification", status: "VERIFIED" as const, uploadedAt: "2022-04-10" },
    { id: "doc-2", name: "PAN Card", type: "Tax / Identification", status: "VERIFIED" as const, uploadedAt: "2022-04-10" },
    { id: "doc-3", name: "Degree Certificate - B.Tech CS", type: "Education", status: "VERIFIED" as const, uploadedAt: "2022-04-11" },
    { id: "doc-4", name: "Passport Document", type: "Travel / Verification", status: "PENDING_REVIEW" as const, uploadedAt: "2025-10-15" },
  ],
  completion: {
    percentage: 85,
    pendingItems: [
      "Upload previous company experience certificate",
      "Add bank account details for payroll compliance",
    ],
  },
};

export function EmployeeProfile() {
  return (
    <div className="space-y-6">
      {/* Header Info Area */}
      <ProfileHeader
        name="Arjun Sharma"
        designation={mockDetailedProfile.employment.designation}
        department={mockDetailedProfile.employment.department}
        workLocation={mockDetailedProfile.employment.workLocation}
        status="ACTIVE"
      />

      {/* Profile Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <PersonalInformation data={mockDetailedProfile.personal} />
          <EmploymentInformation data={mockDetailedProfile.employment} />
          <AddressInformation data={mockDetailedProfile.address} />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-1">
          <ProfileCompletion data={mockDetailedProfile.completion} />
          <EmergencyContact data={mockDetailedProfile.emergency} />
          <DocumentsSummary documents={mockDetailedProfile.documents} />
        </div>
      </div>
    </div>
  );
}