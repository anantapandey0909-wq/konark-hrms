"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/schemas/auth";
import { FORGOT_PASSWORD_DEFAULT_VALUES, AUTH_ROUTES } from "@/constants/auth";

export interface ForgotPasswordFormProps {
  onSubmit?: (values: ForgotPasswordSchema) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  className,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: FORGOT_PASSWORD_DEFAULT_VALUES,
  });

  const handleFormSubmit = async (values: ForgotPasswordSchema) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className={cn("space-y-4", className)}
        noValidate
      >
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className="rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Animated Submit Button */}
        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.01 }}
          whileTap={{ scale: isLoading ? 1 : 0.99 }}
          transition={{ duration: 0.1 }}
          className="pt-2"
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-xl font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </motion.div>

        {/* Back to Login Link */}
        <div className="flex justify-center pt-2">
          <Link
            href={AUTH_ROUTES.login}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1.5 py-1"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
}