"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthLogoProps {
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export function AuthLogo({
  src,
  alt = "Application Logo",
  title = "Konark HRMS",
  subtitle = "Enterprise Management Suite",
  size = "md",
  showSubtitle = true,
  className,
}: AuthLogoProps) {
  const containerSizes = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-12 w-12 rounded-xl",
    lg: "h-16 w-16 rounded-2xl",
  };

  const titleSizes = {
    sm: "text-lg font-bold tracking-tight",
    md: "text-2xl font-extrabold tracking-tight",
    lg: "text-3xl font-black tracking-tight",
  };

  const subtitleSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex flex-col items-center text-center select-none", className)}
    >
      <div className={cn("flex items-center justify-center bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm mb-3", containerSizes[size])}>
        {src ? (
          <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <Building2 className={cn({
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "md",
            "h-8 w-8": size === "lg",
          })} aria-hidden="true" />
        )}
      </div>

      <h1 className={cn("text-zinc-900 dark:text-zinc-50", titleSizes[size])}>
        {title}
      </h1>

      {showSubtitle && subtitle && (
        <p className={cn("text-zinc-500 dark:text-zinc-400 font-medium mt-0.5", subtitleSizes[size])}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}