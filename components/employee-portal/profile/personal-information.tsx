"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Heart, Globe, Mail, Phone, Droplet } from "lucide-react";

interface PersonalData {
  dob: string;
  gender: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  nationality: string;
  personalEmail: string;
  personalPhone: string;
  bloodGroup: string;
}

interface PersonalInformationProps {
  readonly data: PersonalData;
}

export function PersonalInformation({ data }: PersonalInformationProps) {
  const formattedDob = new Date(data.dob).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pt-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Date of Birth
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {formattedDob}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Gender
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.gender}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5" />
            Marital Status
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.maritalStatus}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            Nationality
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.nationality}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Droplet className="h-3.5 w-3.5" />
            Blood Group
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.bloodGroup}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Mobile Number
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {data.personalPhone}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Personal Email
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50 break-all">
            {data.personalEmail}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}