"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavUser() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return null;
  }

  const cleanFirstName = user.firstName?.trim() || "";
  const cleanLastName = user.lastName?.trim() || "";

  const userInitials = (
    (cleanFirstName.charAt(0) || "") + 
    (cleanLastName.charAt(0) || "")
  ).toUpperCase() || "U";

  const userFullName = [cleanFirstName, cleanLastName].filter(Boolean).join(" ") || "Employee";
  const userEmail = user.email || "no-email@domain.com";
  const userRole = user.role ? user.role.toLowerCase() : "employee";

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logout();
      toast.success("Logged out successfully.");
      router.replace("/login");
    } catch {
      toast.error("Failed to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isLoggingOut}
            className="
              flex w-full items-center gap-3 rounded-xl
              p-2 transition-colors
              hover:bg-zinc-100
              dark:hover:bg-zinc-900
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shrink-0">
              {userInitials}
            </div>

            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-semibold truncate">
                {userFullName}
              </p>

              <p className="text-xs capitalize text-zinc-500 dark:text-zinc-400 truncate">
                {userRole}
              </p>
            </div>

            <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64"
        >
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold truncate">
                {userFullName}
              </span>

              <span className="text-xs font-normal text-muted-foreground truncate">
                {userEmail}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/profile"
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/settings"
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="cursor-pointer text-red-600 focus:text-red-600 disabled:pointer-events-none disabled:opacity-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}