"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
  className,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-zinc-900 md:p-8">
      {/* Background Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -left-[20%] -top-[40%] h-[80%] w-[80%] rounded-full bg-blue-100/20 blur-[120px] dark:bg-blue-950/10" />
        <div className="absolute -right-[20%] -bottom-[40%] h-[80%] w-[80%] rounded-full bg-indigo-100/20 blur-[120px] dark:bg-indigo-950/10" />
      </div>

      {/* Animated Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("relative z-10 w-full max-w-md", className)}
      >
        <Card className="border-zinc-200/80 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:backdrop-blur-md">
          <section aria-labelledby="auth-card-title">
            <CardHeader className="space-y-1.5 text-center">
              <CardTitle id="auth-card-title" className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {title}
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">
                {description}
              </CardDescription>
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
    </main>
  );
}