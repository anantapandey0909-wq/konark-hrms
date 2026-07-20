"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  icon,
  className,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("w-full max-w-md", className)}
    >
      <Card className="border-zinc-200/80 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:backdrop-blur-md">
        <section aria-labelledby="auth-card-title">
          <CardHeader className="space-y-1.5 text-center">
            {icon && (
              <div className="flex justify-center mb-2" aria-hidden="true">
                {icon}
              </div>
            )}
            <CardTitle id="auth-card-title" className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-zinc-500 dark:text-zinc-400">
                {description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="grid gap-4">
            {children}
          </CardContent>

          {footer && (
            <CardFooter className="flex flex-col items-center justify-center border-t border-zinc-100 py-4 dark:border-zinc-800/60">
              {footer}
            </CardFooter>
          )}
        </section>
      </Card>
    </motion.div>
  );
}