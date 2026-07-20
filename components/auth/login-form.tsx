"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginSchema } from "@/schemas/auth";
import { LOGIN_DEFAULT_VALUES, AUTH_ROUTES } from "@/constants/auth";

export interface LoginFormProps {
  onSubmit?: (values: LoginSchema) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  className,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });

  const handleFormSubmit = async (values: LoginSchema) => {
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

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href={AUTH_ROUTES.forgotPassword}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember Me Checkbox */}
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-1">
              <FormControl>
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  className="rounded-md"
                />
              </FormControl>
              <FormLabel
                htmlFor="remember-me"
                className="text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none cursor-pointer"
              >
                Remember me on this device
              </FormLabel>
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
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}