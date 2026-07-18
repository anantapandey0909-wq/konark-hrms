"use client";

import * as React from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ResolvedDepartment } from "@/types/department";

interface DepartmentDeleteDialogProps {
  open: boolean;
  department: ResolvedDepartment | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (department: ResolvedDepartment) => Promise<void> | void;
}

export function DepartmentDeleteDialog({
  open,
  department,
  loading = false,
  onOpenChange,
  onConfirm,
}: DepartmentDeleteDialogProps) {
  if (!department) return null;

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onConfirm(department);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-xl select-none">
        <AlertDialogHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto sm:mx-0">
            <AlertTriangle className="h-5.5 w-5.5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <AlertDialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Delete Department
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete this department? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Informative department properties block */}
        <div className="my-4 rounded-lg bg-muted/40 p-4 border border-muted/50 text-xs space-y-2.5">
          <div className="flex justify-between items-center py-0.5 border-b border-muted/30">
            <span className="text-muted-foreground font-medium">Department Name</span>
            <span className="font-semibold text-foreground select-all">{department.name}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-muted/30">
            <span className="text-muted-foreground font-medium">Department Code</span>
            <span className="font-semibold text-foreground select-all">{department.code}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-muted/30">
            <span className="text-muted-foreground font-medium">Employee Count</span>
            <span className="font-semibold text-foreground">{department.employeeCount}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-muted-foreground font-medium">Head Employee</span>
            <span className="font-semibold text-foreground select-all">
              {department.headEmployee?.fullName || "Unassigned"}
            </span>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel
            disabled={loading}
            className="rounded-xl border-muted/60 font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "rounded-xl font-medium gap-2 transition-transform duration-100 active:scale-95"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Department</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}