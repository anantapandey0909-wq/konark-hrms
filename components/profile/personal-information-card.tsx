'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  CalendarRange,
  Fingerprint,
} from 'lucide-react';

interface PersonalInformationCardProps {
  profile: UserProfile;
}

export default function PersonalInformationCard({
  profile,
}: PersonalInformationCardProps) {
  const fields = [
    {
      label: 'Full Legal Name',
      value: `${profile.firstName} ${profile.lastName}`,
      icon: User,
    },
    {
      label: 'Primary Contact Email',
      value: profile.email,
      icon: Mail,
    },
    {
      label: 'Contact Phone Number',
      value: profile.phone,
      icon: Phone,
    },
    {
      label: 'Date of Birth',
      value: profile.dateOfBirth,
      icon: CalendarRange,
    },
    {
      label: 'Gender Identification',
      value: profile.gender,
      icon: User,
      capitalize: true,
    },
    {
      label: 'Blood Group',
      value: profile.bloodGroup,
      icon: Fingerprint,
    },
    {
      label: 'Physical Address',
      value: profile.address,
      icon: MapPin,
      colSpan: true,
    },
    {
      label: 'Emergency Contact Person',
      value: `${profile.emergencyContact.name} (${profile.emergencyContact.relationship}) - ${profile.emergencyContact.phone}`,
      icon: Heart,
      colSpan: true,
    },
  ];

  return (
    <Card className="overflow-hidden border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/20">
        <div className="flex items-center space-x-2.5">
          <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <User className="h-4 w-4" />
          </div>

          <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
            Personal Information
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-5 text-xs text-zinc-500 sm:grid-cols-2">
          {fields.map((field, index) => {
            const Icon = field.icon;

            return (
              <div
                key={index}
                className={`rounded-lg border border-zinc-200 bg-zinc-50/20 p-3 dark:border-zinc-800/80 dark:bg-zinc-950/20 ${
                  field.colSpan ? 'sm:col-span-2' : ''
                }`}
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                  <Icon className="h-3.5 w-3.5" />
                  {field.label}
                </span>

                <p
                  className={`mt-1.5 text-[11.5px] font-bold leading-normal text-zinc-800 dark:text-zinc-100 ${
                    field.capitalize ? 'capitalize' : ''
                  }`}
                >
                  {field.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}