"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Compass } from "lucide-react";

interface AddressDetails {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface AddressData {
  present: AddressDetails;
  permanent: AddressDetails;
}

interface AddressInformationProps {
  readonly data: AddressData;
}

export function AddressInformation({ data }: AddressInformationProps) {
  const formatAddress = (addr: AddressDetails) => {
    return `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.zipCode}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Home className="h-4 w-4 text-slate-400" />
          Address Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pt-5 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5" />
            Present Address
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
            {formatAddress(data.present)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" />
            Permanent Address
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
            {formatAddress(data.permanent)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}