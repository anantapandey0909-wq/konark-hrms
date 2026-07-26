"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UnauthorizedProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function Unauthorized({
  title = "Access Denied",
  description = "You do not have permission to access this resource. Please contact your administrator if you believe this is an error.",
  showBackButton = true,
  showHomeButton = true,
}: UnauthorizedProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center py-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            )}

            {showHomeButton && (
              <Button asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}